import { DepartmentService } from '../../../services/department/DepartmentService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    const departments = await new DepartmentService().list()
    return { success: true, departments }
  })
})
