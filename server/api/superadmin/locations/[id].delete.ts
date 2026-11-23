import { LocationService } from '../../../services/location/LocationService'
import { runSuperadminCatalogWrite } from '../../../utils/runSuperadminCatalogWrite'

export default defineEventHandler(async (event) => {
  return await runSuperadminCatalogWrite(event, async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Barangay id is required' })
    }
    await new LocationService().remove(id)
    return { success: true }
  })
})
