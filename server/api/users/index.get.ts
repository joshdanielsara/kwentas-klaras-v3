import { UserService } from '../../services/user/UserService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const userService = new UserService()
    const users = await userService.list()

    return {
      success: true,
      users,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch users'
  })
})

