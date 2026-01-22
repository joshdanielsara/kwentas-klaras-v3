import { ProjectService } from '../../services/project/ProjectService'
import { requireAdmin } from '../../utils/auth'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
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
    const result = await projectService.remove(id, user.id)

    return result
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to delete project'
  })
})
