import { computed } from 'vue'
import { ADMIN_MENU } from '~/constants/admin/adminMenu'
import { resolveAdminNavPermission } from '~/constants/admin/adminNavPermissions'
import { useUserPermissions } from '~/composables/user/useUserPermissions'

export const useAdminNavPermissions = () => {
  const { can } = useUserPermissions()

  const canAccessNav = (action: string, subject: string): boolean => {
    return can('manage', 'all') || can(action, subject)
  }

  const canAccessPath = (path: string): boolean => {
    const required = resolveAdminNavPermission(path)
    if (!required) {
      return true
    }
    return canAccessNav(required.action, required.subject)
  }

  const visibleMenu = computed(() => {
    return ADMIN_MENU.filter((item) => canAccessPath(item.path))
  })

  const firstAllowedAdminPath = computed(() => {
    const first = visibleMenu.value[0]
    return first?.path ?? null
  })

  return {
    canAccessNav,
    canAccessPath,
    visibleMenu,
    firstAllowedAdminPath,
  }
}
