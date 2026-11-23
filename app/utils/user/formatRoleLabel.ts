import { UserRole, UserRoleLabels } from '../../enums/UserRole'

export const formatRoleLabel = (roleSlug: string, roleName?: string | null): string => {
  if (roleName && roleName.trim()) {
    return roleName.trim()
  }

  const normalized = roleSlug.trim().toLowerCase()
  if (normalized === UserRole.ADMIN) {
    return UserRoleLabels[UserRole.ADMIN]
  }
  if (normalized === UserRole.STAFFS) {
    return UserRoleLabels[UserRole.STAFFS]
  }

  if (!normalized) {
    return 'Unknown'
  }

  return normalized
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
