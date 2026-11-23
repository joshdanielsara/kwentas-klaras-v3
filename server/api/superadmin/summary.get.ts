import { PermissionService } from '../../services/rbac/PermissionService'
import { RoleService } from '../../services/rbac/RoleService'
import { RbacBootstrapService } from '../../services/rbac/RbacBootstrapService'
import { requireSuperadmin } from '../../utils/requireSuperadmin'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await new RbacBootstrapService().ensureDefaults()
    const [roles, permissions] = await Promise.all([
      new RoleService().list(),
      new PermissionService().list(),
    ])

    return {
      success: true,
      summary: {
        roleCount: roles.length,
        permissionCount: permissions.length,
        systemRoleCount: roles.filter((role) => role.isSystem).length,
        customPermissionCount: permissions.filter((permission) => !permission.isSystem).length,
      },
    }
  })
})
