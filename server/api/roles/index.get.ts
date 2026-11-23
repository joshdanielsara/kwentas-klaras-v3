import { RoleService } from '../../services/rbac/RoleService'
import { RbacBootstrapService } from '../../services/rbac/RbacBootstrapService'
import { requireAuth } from '../../utils/auth'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireAuth(event)
    await new RbacBootstrapService().ensureDefaults()
    const roles = await new RoleService().list()
    return {
      success: true,
      roles: roles.map((role) => ({
        id: role.id,
        slug: role.slug,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      })),
    }
  })
})
