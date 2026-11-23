export interface RolePermissionSummary {
  id: string
  key: string
  action: string
  subject: string
  label: string
}

export interface RoleItem {
  id: string
  slug: string
  name: string
  description?: string | null
  isSystem: boolean
  permissionIds: string[]
  permissions?: RolePermissionSummary[]
  userCount: number
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export interface RoleOption {
  id: string
  slug: string
  name: string
  description?: string | null
  isSystem: boolean
}
