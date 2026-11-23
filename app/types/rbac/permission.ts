export interface PermissionItem {
  id: string
  key: string
  action: string
  subject: string
  label: string
  description?: string | null
  isSystem: boolean
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export interface UserPermissionGrant {
  key: string
  action: string
  subject: string
}
