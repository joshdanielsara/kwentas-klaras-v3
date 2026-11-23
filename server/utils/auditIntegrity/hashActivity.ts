import { createHash } from 'node:crypto'
import { canonicalizeActivity, type ActivityIntegrityPayload } from './canonicalizeActivity'

export const hashActivityPayload = (payload: ActivityIntegrityPayload): string => {
  const canonical = canonicalizeActivity(payload)
  return createHash('sha256').update(canonical, 'utf8').digest('hex')
}
