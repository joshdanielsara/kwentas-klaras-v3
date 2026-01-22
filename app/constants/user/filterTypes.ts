export const USER_FILTER_TYPES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
} as const

export type UserFilterType = typeof USER_FILTER_TYPES[keyof typeof USER_FILTER_TYPES]
