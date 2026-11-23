import {
  INTEGRITY_TIMELINE_TONE,
  type IntegrityTimelineTone,
} from '~/constants/audit/integrityTimeline'

export const integrityTimelineDotClass = (tone: IntegrityTimelineTone): string => {
  if (tone === INTEGRITY_TIMELINE_TONE.SUCCESS) {
    return 'bg-emerald-500 ring-emerald-100'
  }
  if (tone === INTEGRITY_TIMELINE_TONE.DANGER) {
    return 'bg-red-500 ring-red-100'
  }
  if (tone === INTEGRITY_TIMELINE_TONE.WARNING) {
    return 'bg-amber-500 ring-amber-100'
  }
  return 'bg-gray-400 ring-gray-100'
}
