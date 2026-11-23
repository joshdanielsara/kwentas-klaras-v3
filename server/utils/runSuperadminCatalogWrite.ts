import type { EventHandlerRequest, H3Event } from 'h3'
import { requireSuperadmin } from './requireSuperadmin'
import { requireCSRF } from './csrfMiddleware'
import { withErrorHandler } from './errorHandler'

export const runSuperadminCatalogWrite = async <T>(
  event: H3Event<EventHandlerRequest>,
  work: () => Promise<T>
) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)
    return await work()
  })
}
