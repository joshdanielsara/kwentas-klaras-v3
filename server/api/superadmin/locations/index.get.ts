import { LocationService } from '../../../services/location/LocationService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    const locations = await new LocationService().list()
    return { success: true, locations }
  })
})
