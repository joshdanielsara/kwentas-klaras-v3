import { SYSTEM_ROLE_SLUGS } from '../../constants/rbac/permissionCatalog'

export const roleRequiresDepartment = (roleSlug: string): boolean => {
  return roleSlug.trim().toLowerCase() !== SYSTEM_ROLE_SLUGS.ADMIN
}
