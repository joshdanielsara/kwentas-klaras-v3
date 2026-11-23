import { buildPermissionKey } from '../../app/constants/rbac/permissionCatalog'

const ACTION_PATTERN = /^[a-z][a-z0-9_-]*$/
const SUBJECT_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/

export const normalizePermissionAction = (action: string): string => {
  return action.trim().toLowerCase()
}

export const normalizePermissionSubject = (subject: string): string => {
  return subject.trim()
}

export const validatePermissionParts = (action: string, subject: string): string | null => {
  const normalizedAction = normalizePermissionAction(action)
  const normalizedSubject = normalizePermissionSubject(subject)

  if (!normalizedAction || !ACTION_PATTERN.test(normalizedAction)) {
    return 'Action must start with a letter and contain only lowercase letters, numbers, underscores, or hyphens'
  }

  if (!normalizedSubject || !SUBJECT_PATTERN.test(normalizedSubject)) {
    return 'Subject must start with a letter and contain only letters, numbers, underscores, or hyphens'
  }

  return null
}

export const toPermissionKey = (action: string, subject: string): string => {
  return buildPermissionKey(
    normalizePermissionAction(action),
    normalizePermissionSubject(subject)
  )
}
