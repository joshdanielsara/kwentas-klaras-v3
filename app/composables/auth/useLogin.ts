import { useErrorHandler } from '../error/useErrorHandler'
import { useFirebase } from '../firebase/useFirebase'
import type { LoginForm } from '~/types/auth/login'
import { validateLoginForm } from '~/utils/loginValidation'
import { useAuthStore } from '~/stores/authStore'
import type { User } from '~/types/user/user'

export const useLogin = () => {
  const form = reactive<LoginForm>({
    email: '',
    password: '',
  })

  const INVALID_CREDENTIALS_MESSAGE = 'Invalid Email or Password, Please try again'
  const GENERIC_LOGIN_FAILED_MESSAGE = 'Login failed. Please try again.'

  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)
  const showSuccessModal = ref(false)
  const showErrorModal = ref(false)
  const errorMessage = ref('')
  const authStore = useAuthStore()

  const getSafeLoginErrorMessage = (rawMessage: string): string => {
    const msg = (rawMessage || '').toLowerCase()

    const isCredentialError =
      msg.includes('auth/invalid-credential') ||
      msg.includes('auth/wrong-password') ||
      msg.includes('auth/user-not-found') ||
      msg.includes('auth/invalid-login-credentials') ||
      msg.includes('invalid email or password') ||
      msg.includes('user not found in database') ||
      msg.includes('invalid id token')

    if (isCredentialError) {
      return INVALID_CREDENTIALS_MESSAGE
    }

    return GENERIC_LOGIN_FAILED_MESSAGE
  }

  const handleLogin = async () => {
    error.value = ''
    loading.value = true
    showErrorModal.value = false

    const validationError = validateLoginForm(form)
    if (validationError) {
      error.value = validationError
      errorMessage.value = validationError
      showErrorModal.value = true
      loading.value = false
      return
    }

    await useErrorHandler(async () => {
      const { login } = useFirebase()
      const user = await login(form.email, form.password)
      const idToken = await user.getIdToken()

      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
        method: 'POST',
        body: { idToken }
      })

      if (response.success && response.user) {
        authStore.setUser(response.user)
        showSuccessModal.value = true
        loading.value = false
      }

      loading.value = false
    }, {
      defaultMessage: INVALID_CREDENTIALS_MESSAGE,
      onError: (err) => {
        const safeMessage = getSafeLoginErrorMessage(err.message)
        error.value = safeMessage
        errorMessage.value = safeMessage
        showErrorModal.value = true
        loading.value = false
      }
    })
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const closeSuccessModal = async () => {
    showSuccessModal.value = false
    await navigateTo('/admin')
  }

  const closeErrorModal = () => {
    showErrorModal.value = false
  }

  return {
    form,
    loading,
    error,
    showPassword,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleLogin,
    togglePasswordVisibility,
    closeSuccessModal,
    closeErrorModal,
  }
}

