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
    const user = await userService.get(id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return {
      success: true,
      user,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch user'
  })
})

