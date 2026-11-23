import { withErrorHandler } from '../../../utils/errorHandler'
import { strictRateLimiter } from '../../../utils/rateLimiter'
import {
  setSuperadminSessionCookie,
  timingSafeEqualString,
} from '../../../utils/superadminSession'

export default defineEventHandler(async (event) => {
  await strictRateLimiter(event)

  return await withErrorHandler(async () => {
    const body = await readBody<{ email?: string; password?: string }>(event)
    const email = body.email?.trim().toLowerCase() || ''
    const password = body.password || ''

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required',
      })
    }

    const config = useRuntimeConfig()
    const expectedEmail = typeof config.superadminEmail === 'string'
      ? config.superadminEmail.trim().toLowerCase()
      : ''
    const expectedPassword = typeof config.superadminPassword === 'string'
      ? config.superadminPassword
      : ''

    if (!expectedEmail || !expectedPassword) {
      throw createError({
        statusCode: 500,
        message: 'Superadmin credentials are not configured',
      })
    }

    const emailMatches = timingSafeEqualString(email, expectedEmail)
    const passwordMatches = timingSafeEqualString(password, expectedPassword)
    if (!emailMatches || !passwordMatches) {
      throw createError({
        statusCode: 401,
        message: 'Invalid Superadmin credentials',
      })
    }

    setSuperadminSessionCookie(event, expectedEmail)

    return {
      success: true,
      superadmin: {
        email: expectedEmail,
      },
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid Superadmin credentials',
  })
})
