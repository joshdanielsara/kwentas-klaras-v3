import { DepartmentService } from '../../../services/department/DepartmentService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Implementing unit id is required' })
    }
    const body = await readBody(event)
    const department = await new DepartmentService().update(id, sanitizeString(body.name) || '')
    return { success: true, department }
  })
})
