const SLUG_PATTERN = /^[a-z][a-z0-9_-]*$/

export const normalizeRoleSlug = (slug: string): string => {
  return slug.trim().toLowerCase()
}

export const validateRoleSlug = (slug: string): string | null => {
  const normalized = normalizeRoleSlug(slug)
  if (!normalized || !SLUG_PATTERN.test(normalized)) {
    return 'Role slug must start with a lowercase letter and contain only lowercase letters, numbers, underscores, or hyphens'
  }
  return null
}
