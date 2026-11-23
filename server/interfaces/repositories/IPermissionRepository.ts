import type { Permission, Prisma } from '@prisma/client'

export interface IPermissionRepository {
  create(data: Prisma.PermissionCreateInput): Promise<Permission>
  findAll(): Promise<Permission[]>
  findById(id: string): Promise<Permission | null>
  findByKey(key: string): Promise<Permission | null>
  findByKeys(keys: string[]): Promise<Permission[]>
  updateById(id: string, data: Prisma.PermissionUpdateInput): Promise<Permission>
  deleteById(id: string): Promise<Permission>
  countRoleLinks(permissionId: string): Promise<number>
}
