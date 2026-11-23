import { ADMIN_MENU } from '../constants/admin/adminMenu'
import { resolveAdminNavPermission } from '../constants/admin/adminNavPermissions'

/** Minimal CASL surface used by nav checks (works with DeepReadonly refs). */
export interface AbilityCanCheck {
  can: (action: string, subject: string) => boolean
}

export const canAbilityAccessNav = (
  ability: AbilityCanCheck | null | undefined,
  action: string,
  subject: string
): boolean => {
  if (!ability) {
    return false
  }
  return ability.can('manage', 'all') || ability.can(action, subject)
}

export const canAbilityAccessPath = (
  ability: AbilityCanCheck | null | undefined,
  path: string
): boolean => {
  const required = resolveAdminNavPermission(path)
  if (!required) {
    return true
  }
  return canAbilityAccessNav(ability, required.action, required.subject)
}

export const findFirstAllowedAdminPath = (
  ability: AbilityCanCheck | null | undefined
): string | null => {
  const allowed = ADMIN_MENU.find((item) => canAbilityAccessPath(ability, item.path))
  return allowed?.path ?? null
}
