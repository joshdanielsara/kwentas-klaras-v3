import { createHash } from 'node:crypto'
import { canonicalizeProject, type ProjectIntegrityPayload } from './canonicalizeProject'

export const hashProjectPayload = (payload: ProjectIntegrityPayload): string => {
  return createHash('sha256').update(canonicalizeProject(payload), 'utf8').digest('hex')
}
