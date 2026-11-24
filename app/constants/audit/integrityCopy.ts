import { PUBLIC_INTEGRITY_STATUS, type PublicIntegrityStatus } from './integrityStatus'

export const PUBLIC_INTEGRITY_HELPER_DEFAULT =
  'This confirms sealed project data and activity history still match what is on file.'

export const PUBLIC_INTEGRITY_HELPER: Record<PublicIntegrityStatus, string> = {
  [PUBLIC_INTEGRITY_STATUS.NONE]: 'No sealed project records yet for this project.',
  [PUBLIC_INTEGRITY_STATUS.PENDING]:
    'A newer activity was just recorded and is being sealed automatically. Wait a few seconds — the check refreshes on its own. This is normal after an edit — not tampering.',
  [PUBLIC_INTEGRITY_STATUS.SEALED]: PUBLIC_INTEGRITY_HELPER_DEFAULT,
  [PUBLIC_INTEGRITY_STATUS.VERIFIED]:
    'Check passed — every sealed batch for this project still matches (not only the latest seal).',
  [PUBLIC_INTEGRITY_STATUS.FAILED]:
    'Check failed — a sealed batch no longer matches (project data, money rows, activity history, or a missing seal leaf).',
}
