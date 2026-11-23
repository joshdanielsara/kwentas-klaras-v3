import type { Permission, Role } from '@prisma/client'

export class RoleSerializer {
  static formatRole(role: Role, extras?: { permissionIds?: string[]; userCount?: number; permissions?: Permission[] }) {
    return {
      id: role.id,
      slug: role.slug,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissionIds: extras?.permissionIds ?? [],
      permissions: (extras?.permissions ?? []).map((permission) => ({
        id: permission.id,
        key: permission.key,
        action: permission.action,
        subject: permission.subject,
        label: permission.label,
      })),
      userCount: extras?.userCount ?? 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }
  }

  static list(roles: Array<{ role: Role; permissionIds?: string[]; userCount?: number }>) {
    return roles.map(({ role, permissionIds, userCount }) => this.formatRole(role, { permissionIds, userCount }))
  }
}
