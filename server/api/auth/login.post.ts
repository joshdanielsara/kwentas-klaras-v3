import { getFirebaseAuth } from '../../lib/firebase'

export default defineEventHandler(async (event) => {
  const { idToken } = await readBody(event)

  if (!idToken) {
    throw createError({
      statusCode: 400,
      message: 'ID token is required'
    })
  }

  try {
    const firebaseAuth = getFirebaseAuth()
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    const sessionToken = crypto.randomUUID()
    setCookie(event, 'session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: 'Invalid ID token'
    })
  }
})
