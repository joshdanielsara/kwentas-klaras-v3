import { RemarkService } from '../../services/remark/RemarkService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const remarkService = new RemarkService()
    const remarks = await remarkService.list()

    return {
      success: true,
      remarks,
    }
  })
})
