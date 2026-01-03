import { useUsers } from './useUsers'
import { useErrorHandler } from '../error/useErrorHandler'
import { getRequiredFields } from '~/constants/user/requiredFields'
import type { UserWithPassword } from '~/types/user/userWithPassword'
import type { User } from '~/types/user/user'
import { UserRole } from '~/enums/UserRole'
import { asyncHandler } from '~/utils/asyncHandler'

export const useUserEditForm = (editingUser: Ref<User | null>) => {
  const { handleSaveUser } = useUsers()

  const form = reactive({
    role: UserRole.STAFFS as string,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    department: '',
    status: 'Active' as 'Active' | 'Inactive',
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const requiredFields = computed(() => getRequiredFields(form, form.role))
  const requiredFieldsCount = computed(() => requiredFields.value.length)
  const remainingRequiredFields = computed(() => {
    return requiredFields.value.filter(field => !field.value()).length
  })

  const isFormValid = computed(() => {
    return remainingRequiredFields.value === 0
  })

  watch(editingUser, (user) => {
    if (user) {
      form.role = user.role
      form.firstName = user.firstName
      form.lastName = user.lastName
      form.username = user.username?.startsWith('@') ? user.username.slice(1) : user.username
      form.email = user.email
      form.department = user.department || ''
      form.status = user.status || 'Active'
    }
  }, { immediate: true })

  const handleSubmit = async () => {
    error.value = null
    loading.value = true

    try {
      if (!editingUser.value) {
        error.value = 'User not found'
        loading.value = false
        throw new Error('User not found')
      }

      await useErrorHandler(async () => {
        const usernameWithoutAt = form.username.startsWith('@')
          ? form.username.slice(1)
          : form.username

        const userData: UserWithPassword = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          username: usernameWithoutAt,
          email: form.email.trim(),
          role: form.role,
          department: form.role === UserRole.ADMIN ? '' : form.department,
          status: form.status,
        }

        await handleSaveUser(userData, editingUser.value)
      }, {
        defaultMessage: 'Failed to update user',
        onError: (err: Error) => {
          error.value = err.message
          loading.value = false
          throw err
        }
      })
      loading.value = false
      return { success: true }
    } catch (err) {
      loading.value = false
      throw err
    }
  }

  return {
    form,
    loading,
    error,
    requiredFieldsCount,
    remainingRequiredFields,
    isFormValid,
    handleSubmit,
  }
}

