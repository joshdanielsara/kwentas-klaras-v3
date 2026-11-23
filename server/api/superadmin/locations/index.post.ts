import { LocationService } from '../../../services/location/LocationService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'
import { sanitizeString } from '../../../utils/sanitize'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const body = await readBody(event)
    const location = await new LocationService().create(sanitizeString(body.name) || '')
    return { success: true, location }
  })
})
