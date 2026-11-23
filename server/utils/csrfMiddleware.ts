import type { H3Event } from 'h3'
import { generateCSRFToken, validateCSRFToken } from './csrf'
import { SUPERADMIN_SESSION_COOKIE } from '../constants/superadmin/session'

const getCsrfSessionId = (event: H3Event): string | null => {
  return getCookie(event, 'session_token') || getCookie(event, SUPERADMIN_SESSION_COOKIE) || null
}

export async function requireCSRF(event: H3Event): Promise<void> {
  const method = getMethod(event)
  
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return
  }

  const sessionToken = getCsrfSessionId(event)
  
  if (!sessionToken) {
    throw createError({
      statusCode: 403,
      message: 'CSRF token validation requires a session'
    })
  }

  const csrfToken = getHeader(event, 'x-csrf-token') || getQuery(event).csrfToken as string

  if (!csrfToken) {
    throw createError({
      statusCode: 403,
      message: 'CSRF token is required'
    })
  }

  if (!validateCSRFToken(sessionToken, csrfToken as string)) {
    throw createError({
      statusCode: 403,
      message: 'Invalid CSRF token'
    })
  }
}

export function generateCSRFTokenForSession(event: H3Event): string | null {
  const sessionToken = getCsrfSessionId(event)
  
  if (!sessionToken) {
    return null
  }

  return generateCSRFToken(sessionToken)
}
