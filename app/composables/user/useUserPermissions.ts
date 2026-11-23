import { useAuthStore } from '~/stores/authStore'
import { UserRole } from '~/enums/UserRole'

export const useUserPermissions = () => {
  const authStore = useAuthStore()
  const user = authStore.user

  const can = (action: string, subject: string): boolean => {
    return authStore.ability.value?.can(action, subject) ?? false
  }

  const isAdmin = computed(() => {
    return user.value?.role === UserRole.ADMIN || can('manage', 'all')
  })

  const isStaff = computed(() => {
    return user.value?.role === UserRole.STAFFS
  })

  const canManageUsers = computed(() => {
    return can('manage', 'all') || can('create', 'User') || can('update', 'User') || can('delete', 'User')
  })

  const canViewUsers = computed(() => {
    return can('manage', 'all') || can('read', 'User') || canManageUsers.value
  })

  const canManageProjects = computed(() => {
    return can('manage', 'all') || can('create', 'Project') || can('update', 'Project') || can('delete', 'Project')
  })

  return {
    isAdmin,
    isStaff,
    canManageUsers,
    canViewUsers,
    canManageProjects,
    can,
  }
}
