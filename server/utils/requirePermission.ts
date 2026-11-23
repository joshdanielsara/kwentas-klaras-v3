import type { EventHandlerRequest, H3Event } from 'h3'
import { requireAuth, type AuthenticatedUser } from './auth'
import { RoleService } from '../services/rbac/RoleService'
import { RbacBootstrapService } from '../services/rbac/RbacBootstrapService'

export async function requirePermission(
  event: H3Event<EventHandlerRequest>,
  action: string,
  subject: string
): Promise<AuthenticatedUser> {
  const user = await requireAuth(event)
  await new RbacBootstrapService().ensureDefaults()

  const permissions = await new RoleService().getPermissionsForRoleSlug(user.role)
  const allowed = permissions.some((permission) => {
    if (permission.action === 'manage' && permission.subject === 'all') {
      return true
    }
    return permission.action === action && permission.subject === subject
  })

  if (!allowed) {
    throw createError({
      statusCode: 403,
      message: `Missing permission: ${action}:${subject}`,
    })
  }

  return user
}
