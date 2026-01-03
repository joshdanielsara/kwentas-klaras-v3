import { useAuthStore } from '~/stores/authStore'
import { UserRole } from '~/enums/UserRole'

export const useUserPermissions = () => {
  const authStore = useAuthStore()
  const user = authStore.user

  const isAdmin = computed(() => {
    return user.value?.role === UserRole.ADMIN
  })

  const isStaff = computed(() => {
    return user.value?.role === UserRole.STAFFS
  })

  const canManageUsers = computed(() => {
    return isAdmin.value
  })

  const canViewUsers = computed(() => {
    return isAdmin.value || isStaff.value
  })

  const canManageProjects = computed(() => {
    return isAdmin.value
  })

  return {
    isAdmin,
    isStaff,
    canManageUsers,
    canViewUsers,
    canManageProjects,
  }
}

