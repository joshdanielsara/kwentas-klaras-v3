import { UserService } from '../../services/user/UserService'
import type { UpdateUserRequest } from '../../types/user/updateUserRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const body = await readBody<UpdateUserRequest>(event)

  return await withErrorHandler(async () => {
    const userService = new UserService()
    const user = await userService.update(id, body)

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
    defaultMessage: 'Failed to update user'
  })
})

