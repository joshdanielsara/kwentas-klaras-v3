import { ServiceService } from '../../../services/service/ServiceService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Service id is required' })
    }
    await new ServiceService().remove(id)
    return { success: true }
  })
})
