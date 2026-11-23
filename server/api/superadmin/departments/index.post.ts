import { DepartmentService } from '../../../services/department/DepartmentService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const body = await readBody(event)
    const department = await new DepartmentService().create(sanitizeString(body.name) || '')
    return { success: true, department }
  })
})
