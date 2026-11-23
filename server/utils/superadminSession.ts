import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import {
  SUPERADMIN_SESSION_COOKIE,
  SUPERADMIN_SESSION_MAX_AGE_SECONDS,
  SUPERADMIN_SESSION_PAYLOAD_VERSION,
} from '../constants/superadmin/session'
import { IS_PRODUCTION } from '../constants/environment'

export interface SuperadminSessionPayload {
  v: number
  email: string
  exp: number
}

const getSessionSecret = (): string => {
  const config = useRuntimeConfig()
  const secret = config.superadminSessionSecret
  if (!secret || typeof secret !== 'string' || secret.length < 16) {
    throw createError({
      statusCode: 500,
      message: 'SUPERADMIN_SESSION_SECRET is not configured',
    })
  }
  return secret
}

const signPayload = (encodedPayload: string, secret: string): string => {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url')
}

export const createSuperadminSessionToken = (email: string): string => {
  const secret = getSessionSecret()
  const payload: SuperadminSessionPayload = {
    v: SUPERADMIN_SESSION_PAYLOAD_VERSION,
    email,
    exp: Math.floor(Date.now() / 1000) + SUPERADMIN_SESSION_MAX_AGE_SECONDS,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = signPayload(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export const verifySuperadminSessionToken = (token: string): SuperadminSessionPayload | null => {
  const secret = getSessionSecret()
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) {
    return null
  }

  const expected = signPayload(encodedPayload, secret)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SuperadminSessionPayload
    if (payload.v !== SUPERADMIN_SESSION_PAYLOAD_VERSION || !payload.email || !payload.exp) {
      return null
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch (error) {
    console.error('[superadminSession] failed to parse session payload', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return null
  }
}

export const setSuperadminSessionCookie = (event: H3Event, email: string): void => {
  const token = createSuperadminSessionToken(email)
  setCookie(event, SUPERADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
    maxAge: SUPERADMIN_SESSION_MAX_AGE_SECONDS,
  })
}

export const clearSuperadminSessionCookie = (event: H3Event): void => {
  deleteCookie(event, SUPERADMIN_SESSION_COOKIE, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
  })
}

export const readSuperadminSession = (event: H3Event): SuperadminSessionPayload | null => {
  const token = getCookie(event, SUPERADMIN_SESSION_COOKIE)
  if (!token) {
    return null
  }
  return verifySuperadminSessionToken(token)
}

export const timingSafeEqualString = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }
  return timingSafeEqual(leftBuffer, rightBuffer)
}
