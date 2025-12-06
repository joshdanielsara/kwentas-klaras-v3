import { UserService } from '../../services/user/UserService'
import type { CreateUserRequest } from '../../types/user/createUserRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateUserRequest>(event)

  if (!body.firstName || !body.lastName || !body.username || !body.email || !body.password || !body.department) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: firstName, lastName, username, email, password, department'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  if (body.password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters long'
    })
  }

  return await withErrorHandler(async () => {
    const userService = new UserService()
    const user = await userService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: body.password,
      department: body.department,
      status: body.status,
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

