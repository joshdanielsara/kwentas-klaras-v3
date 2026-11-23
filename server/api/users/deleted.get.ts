import { UserRepository } from '../../repositories/user/UserRepository'
import { UserSerializer } from '../../serializers/UserSerializer'
import { requirePermission } from '../../utils/requirePermission'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'read', 'User')


  return await withErrorHandler(async () => {
    const userRepository = new UserRepository()
    const deletedUsers = await userRepository.findDeleted()

    return {
      success: true,
      users: deletedUsers.map(user => UserSerializer.formatUser(user))
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch deleted users'
  })
})
