import { UserService } from '../../services/user/UserService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const userService = new UserService()
    const result = await userService.remove(id)

    return result
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to delete user'
  })
})

