export const INTEGRITY_TECHNICAL_DETAILS_TITLE = 'How this seal works'

export const INTEGRITY_TECHNICAL_DETAILS_SUBTITLE = 'Easy explanation'

export const INTEGRITY_TECHNICAL_DETAILS_INTRO =
  'This lock shows the project details and activity log were saved honestly. If someone secretly changes them later, the check will fail.'

export const INTEGRITY_TECHNICAL_FIELD = {
  SEALED_AT: {
    label: 'Locked on',
    help: 'When the project record was locked.',
  },
  COVERAGE: {
    label: 'What is locked',
    help: 'Project details plus activity log entries.',
  },
  HISTORY: {
    label: 'History checked',
    help: 'Every past seal for this project, not only the latest.',
  },
  BATCH: {
    label: 'Latest seal ID',
    help: 'Code for staff / auditors (newest seal).',
  },
  ROOT: {
    label: 'Lock code',
    help: 'If data changes, this code no longer matches.',
  },
  VERIFY: {
    label: 'Check result',
    help: 'Latest automatic check note.',
  },
} as const

export const INTEGRITY_TECHNICAL_FOOTER =
  'Think of it like a stamped receipt for this government project.'

export const INTEGRITY_TECHNICAL_CODES_TITLE = 'Codes for auditors'

/** Public OpenTimestamps verifier (independent of this site). */
export const OPENTIMESTAMPS_VERIFY_URL = 'https://opentimestamps.org/'

export const INTEGRITY_INDEPENDENT_VERIFY_TITLE = 'Check on your own (optional)'

export const INTEGRITY_INDEPENDENT_VERIFY_INTRO =
  'You can also check this seal on the official OpenTimestamps website.'

export const INTEGRITY_INDEPENDENT_VERIFY_STEPS = [
  'Download the stamp file.',
  'Copy the lock code.',
  'Open OpenTimestamps and use Verify with the lock code + stamp file.',
] as const

export const INTEGRITY_INDEPENDENT_VERIFY_LINK_LABEL = 'Open OpenTimestamps'

export const INTEGRITY_INDEPENDENT_VERIFY_DOWNLOAD_LABEL = 'Download stamp file'

export const INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF =
  'Stamp file is not ready yet.'

export const INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW = [
  'Wait a few seconds, then click Recheck or Load stamp file.',
  'If it still says sealing, wait a bit more after a project update.',
] as const

export const INTEGRITY_INDEPENDENT_VERIFY_RELOAD_LABEL = 'Load stamp file'
