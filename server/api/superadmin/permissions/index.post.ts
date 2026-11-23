import { PermissionService } from '../../../services/rbac/PermissionService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import { requireCSRF } from '../../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)
    const body = await readBody(event)
    const permission = await new PermissionService().create({
      action: body.action,
      subject: body.subject,
      label: body.label,
      description: body.description,
    })
    return { success: true, permission }
  })
})
