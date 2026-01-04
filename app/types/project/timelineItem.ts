export interface TimelineItem {
  label: string
  date: Date
  isPast: boolean
  isCurrent: boolean
  isLast: boolean
  isActivity?: boolean
  description?: string
  action?: string
  originalDate?: Date
  isNewDay?: boolean
}

