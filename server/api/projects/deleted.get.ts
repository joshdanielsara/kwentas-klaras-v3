import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { ProjectSerializer } from '../../serializers/ProjectSerializer'
import { requirePermission } from '../../utils/requirePermission'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'read', 'Project')


  return await withErrorHandler(async () => {
    const projectRepository = new ProjectRepository()
    const deletedProjects = await projectRepository.findDeleted()

    return {
      success: true,
      projects: deletedProjects.map(project => ProjectSerializer.detail(project, 0))
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch deleted projects'
  })
})
