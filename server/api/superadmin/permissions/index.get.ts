import { PermissionService } from '../../../services/rbac/PermissionService'
import { RbacBootstrapService } from '../../../services/rbac/RbacBootstrapService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await new RbacBootstrapService().ensureDefaults()
    const permissions = await new PermissionService().list()
    return { success: true, permissions }
  })
})
