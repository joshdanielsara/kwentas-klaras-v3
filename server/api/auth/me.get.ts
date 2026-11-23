import { withErrorHandler } from '../../utils/errorHandler'
import { UserSerializer } from '../../serializers/UserSerializer'
import { requireAuth } from '../../utils/auth'
import { RoleService } from '../../services/rbac/RoleService'
import { RbacBootstrapService } from '../../services/rbac/RbacBootstrapService'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const user = await requireAuth(event)
    await new RbacBootstrapService().ensureDefaults()
    const permissions = await new RoleService().getPermissionsForRoleSlug(user.role || 'staffs')

    return {
      success: true,
      user: UserSerializer.formatUser(user, permissions)
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid token'
  })
})
