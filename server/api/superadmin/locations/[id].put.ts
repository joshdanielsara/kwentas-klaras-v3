import { LocationService } from '../../../services/location/LocationService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Barangay id is required' })
    }
    const body = await readBody(event)
    const location = await new LocationService().update(id, sanitizeString(body.name) || '')
    return { success: true, location }
  })
})
