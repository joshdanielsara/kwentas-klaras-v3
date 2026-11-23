import { RoleService } from '../../../services/rbac/RoleService'
import { RbacBootstrapService } from '../../../services/rbac/RbacBootstrapService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await new RbacBootstrapService().ensureDefaults()
    const roles = await new RoleService().list()
    return { success: true, roles }
  })
})
