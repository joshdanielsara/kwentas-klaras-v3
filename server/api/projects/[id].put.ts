import { ProjectService } from '../../../server/services/project/ProjectService'
import { withErrorHandler } from '../../../server/utils/errorHandler'
import { requirePermission } from '../../../server/utils/requirePermission'
import { requireCSRF } from '../../../server/utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'update', 'Project')
  await requireCSRF(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  const body = await readBody(event)

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()

    const project = await projectService.update(id, {
      name: body.name,
      implementingUnit: body.implementingUnit,
      location: body.location,
      appropriation: body.appropriation,
      year: body.year,
      services: body.services,
      remarks: body.remarks,
      code: body.code,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      latitude: body.latitude !== undefined ? body.latitude : undefined,
      longitude: body.longitude !== undefined ? body.longitude : undefined,
    })

    if (!project) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    return {
      success: true,
      project,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to update project'
  })
})

