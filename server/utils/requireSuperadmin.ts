import type { EventHandlerRequest, H3Event } from 'h3'
import { readSuperadminSession } from './superadminSession'

export interface SuperadminActor {
  email: string
}

export async function requireSuperadmin(event: H3Event<EventHandlerRequest>): Promise<SuperadminActor> {
  const session = readSuperadminSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Superadmin authentication required',
    })
  }

  const config = useRuntimeConfig()
  const expectedEmail = typeof config.superadminEmail === 'string' ? config.superadminEmail.trim().toLowerCase() : ''
  if (!expectedEmail || session.email.trim().toLowerCase() !== expectedEmail) {
    throw createError({
      statusCode: 403,
      message: 'Superadmin access denied',
    })
  }

  return { email: session.email }
}
