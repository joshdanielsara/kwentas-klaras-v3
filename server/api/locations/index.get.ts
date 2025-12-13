import { LocationService } from '../../services/location/LocationService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const locationService = new LocationService()
    const locations = await locationService.list()

    return {
      success: true,
      locations,
    }
  })
})
