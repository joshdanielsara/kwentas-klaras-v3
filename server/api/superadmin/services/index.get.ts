import { ServiceService } from '../../../services/service/ServiceService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    const services = await new ServiceService().list()
    return { success: true, services }
  })
})
