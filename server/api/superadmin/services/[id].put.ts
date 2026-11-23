import { ServiceService } from '../../../services/service/ServiceService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Service id is required' })
    }
    const body = await readBody(event)
    const service = await new ServiceService().update(id, sanitizeString(body.name) || '')
    return { success: true, service }
  })
})
