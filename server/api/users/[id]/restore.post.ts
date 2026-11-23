import { UserRepository } from '../../../repositories/user/UserRepository'
import { requirePermission } from '../../../utils/requirePermission'
import { requireCSRF } from '../../../utils/csrfMiddleware'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'delete', 'User')

  await requireCSRF(event)
  
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const userRepository = new UserRepository()
    const restoredUser = await userRepository.restoreById(id)

    return {
      success: true,
      message: 'User restored successfully',
      user: restoredUser
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to restore user'
  })
})
