import { DepartmentService } from '../../services/department/DepartmentService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const departmentService = new DepartmentService()
    const departments = await departmentService.list()

    return {
      success: true,
      departments,
    }
  })
})
