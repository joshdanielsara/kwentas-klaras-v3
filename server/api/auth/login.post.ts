import { getFirebaseAuth } from '../../lib/firebase'
import { UserRepository } from '../../repositories/user/UserRepository'
import { UserSerializer } from '../../serializers/UserSerializer'
import { IS_PRODUCTION } from '../../constants/environment'
import { strictRateLimiter } from '../../utils/rateLimiter'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await strictRateLimiter(event)
  
  const { idToken } = await readBody(event)

  if (!idToken) {
    throw createError({
      statusCode: 400,
      message: 'ID token is required'
    })
  }

  return await withErrorHandler(async () => {
    const firebaseAuth = getFirebaseAuth()
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    const userRepository = new UserRepository()
    const dbUser = await userRepository.findByFirebaseIdForAuth(decodedToken.uid)

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found in database'
      })
    }

    if (dbUser.deletedAt) {
      throw createError({
        statusCode: 403,
        message: 'User account has been deleted'
      })
    }

    const sessionToken = crypto.randomUUID()
    setCookie(event, 'session_token', sessionToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      user: UserSerializer.formatUser(dbUser)
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid ID token'
  })
})
