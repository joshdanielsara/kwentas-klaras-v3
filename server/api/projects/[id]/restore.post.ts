import { ProjectService } from '../../../services/project/ProjectService'
import { requirePermission } from '../../../utils/requirePermission'
import { requireCSRF } from '../../../utils/csrfMiddleware'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const user = await requirePermission(event, 'delete', 'Project')

  await requireCSRF(event)
  
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const result = await projectService.restore(id, user.id)

    return result
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to restore project'
  })
})
