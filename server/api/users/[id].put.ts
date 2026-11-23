import { UserService } from '../../services/user/UserService'
import type { UpdateUserRequest } from '../../types/user/updateUserRequest'
import { withErrorHandler } from '../../utils/errorHandler'
import { requirePermission } from '../../utils/requirePermission'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { RoleRepository } from '../../repositories/rbac/RoleRepository'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'update', 'User')
  await requireCSRF(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const body = await readBody<UpdateUserRequest>(event)

  return await withErrorHandler(async () => {
    if (body.role) {
      const role = await new RoleRepository().findBySlug(String(body.role).toLowerCase())
      if (!role) {
        throw createError({
          statusCode: 400,
          message: 'Invalid role selected',
        })
      }
      body.role = role.slug
    }

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

