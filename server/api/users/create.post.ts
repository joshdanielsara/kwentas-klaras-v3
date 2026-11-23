import { UserService } from '../../services/user/UserService'
import type { CreateUserRequest } from '../../types/user/createUserRequest'
import { requirePermission } from '../../utils/requirePermission'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { RoleRepository } from '../../repositories/rbac/RoleRepository'
import { sanitizeString, sanitizeEmail } from '../../utils/sanitize'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'create', 'User')
  await requireCSRF(event)
  
  const body = await readBody<CreateUserRequest>(event)

  const sanitizedBody = {
    firstName: sanitizeString(body.firstName),
    lastName: sanitizeString(body.lastName),
    username: sanitizeString(body.username),
    email: sanitizeEmail(body.email),
    department: sanitizeString(body.department),
    status: body.status ? sanitizeString(body.status) : undefined,
    role: body.role ? sanitizeString(body.role) : undefined,
  }

  const roleSlug = (sanitizedBody.role || 'staffs').toLowerCase()
  const requiresDepartment = roleSlug !== 'admin'

  if (
    !sanitizedBody.firstName ||
    !sanitizedBody.lastName ||
    !sanitizedBody.username ||
    !sanitizedBody.email ||
    (requiresDepartment && !sanitizedBody.department)
  ) {
    throw createError({
      statusCode: 400,
      message: requiresDepartment
        ? 'Missing required fields: firstName, lastName, username, email, department'
        : 'Missing required fields: firstName, lastName, username, email'
    })
  }

  if (!sanitizedBody.email) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  return await withErrorHandler(async () => {
    const roleRepository = new RoleRepository()
    const role = await roleRepository.findBySlug(roleSlug)
    if (!role) {
      throw createError({
        statusCode: 400,
        message: 'Invalid role selected',
      })
    }

    const userService = new UserService()
    const user = await userService.create({
      firstName: sanitizedBody.firstName,
      lastName: sanitizedBody.lastName,
      username: sanitizedBody.username,
      email: sanitizedBody.email,
      department: sanitizedBody.department,
      status: sanitizedBody.status,
      role: role.slug,
    })

    return {
      success: true,
      user,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create user'
  })
})

