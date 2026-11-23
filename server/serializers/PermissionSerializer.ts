import type { Permission } from '@prisma/client'

export class PermissionSerializer {
  static formatPermission(permission: Permission) {
    return {
      id: permission.id,
      key: permission.key,
      action: permission.action,
      subject: permission.subject,
      label: permission.label,
      description: permission.description,
      isSystem: permission.isSystem,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    }
  }

  static list(permissions: Permission[]) {
    return permissions.map((permission) => this.formatPermission(permission))
  }
}