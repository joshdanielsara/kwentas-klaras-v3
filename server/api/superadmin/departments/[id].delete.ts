import { DepartmentService } from '../../../services/department/DepartmentService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Implementing unit id is required' })
    }
    await new DepartmentService().remove(id)
    return { success: true }
  })
})
