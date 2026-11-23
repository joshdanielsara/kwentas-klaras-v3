const NAME_PATTERN = /^[\w\s.'&\-/()]+$/

export const normalizeCatalogName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ')
}

export const validateCatalogName = (name: string): string | null => {
  const normalized = normalizeCatalogName(name)
  if (!normalized) {
    return 'Name is required'
  }
  if (normalized.length < 2) {
    return 'Name must be at least 2 characters'
  }
  if (normalized.length > 120) {
    return 'Name must be 120 characters or fewer'
  }
  if (!NAME_PATTERN.test(normalized)) {
    return 'Name contains invalid characters'
  }
  return null
}
