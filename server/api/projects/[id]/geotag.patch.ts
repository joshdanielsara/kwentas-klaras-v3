import { ProjectService } from '../../../services/project/ProjectService'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  const body = await readBody(event)

  if (body.latitude !== undefined && (typeof body.latitude !== 'number' || body.latitude < -90 || body.latitude > 90)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid latitude. Must be a number between -90 and 90'
    })
  }

  if (body.longitude !== undefined && (typeof body.longitude !== 'number' || body.longitude < -180 || body.longitude > 180)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid longitude. Must be a number between -180 and 180'
    })
  }

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const project = await projectService.update(id, {
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
    defaultMessage: 'Failed to update project geotag'
  })
})

