import type { RolePermission } from '@prisma/client'

export interface IRolePermissionRepository {
  findPermissionIdsByRoleId(roleId: string): Promise<string[]>
  replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<void>
  findByRoleId(roleId: string): Promise<RolePermission[]>
  deleteByRoleId(roleId: string): Promise<void>
  deleteByPermissionId(permissionId: string): Promise<void>
}