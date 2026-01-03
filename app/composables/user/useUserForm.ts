import { useUsers } from './useUsers'
import { useErrorHandler } from '../error/useErrorHandler'
import { getRequiredFields } from '~/constants/user/requiredFields'
import type { UserWithPassword } from '~/types/user/userWithPassword'
import { UserRole } from '~/enums/UserRole'

export const useUserForm = () => {
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

  const handleSubmit = async () => {
    error.value = null
    loading.value = true

    try {
      const result = await useErrorHandler(async () => {
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

        await handleSaveUser(userData, null)
        return { success: true }
      }, {
        defaultMessage: 'Failed to create user',
        onError: (err: Error) => {
          error.value = err.message
          loading.value = false
          throw err
        }
      })
      loading.value = false
      return result
    } catch (err) {
      loading.value = false
      throw err
    }
  }

  const resetForm = () => {
    form.role = UserRole.STAFFS
    form.firstName = ''
    form.lastName = ''
    form.username = ''
    form.email = ''
    form.department = ''
    form.status = 'Active'
    error.value = null
  }

  return {
    form,
    loading,
    error,
    requiredFieldsCount,
    remainingRequiredFields,
    handleSubmit,
    resetForm,
  }
}

