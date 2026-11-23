import { ServiceService } from '../../../services/service/ServiceService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const body = await readBody(event)
    const service = await new ServiceService().create(sanitizeString(body.name) || '')
    return { success: true, service }
  })
})
