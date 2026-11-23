import type { Permission, Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { IPermissionRepository } from '../../interfaces/repositories/IPermissionRepository'

export class PermissionRepository implements IPermissionRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.client.permission.create({ data })
  }

  async findAll(): Promise<Permission[]> {
    return this.client.permission.findMany({
      orderBy: [{ subject: 'asc' }, { action: 'asc' }],
    })
  }

  async findById(id: string): Promise<Permission | null> {
    return this.client.permission.findUnique({ where: { id } })
  }

  async findByKey(key: string): Promise<Permission | null> {
    return this.client.permission.findUnique({ where: { key } })
  }

  async findByKeys(keys: string[]): Promise<Permission[]> {
    if (keys.length === 0) {
      return []
    }
    return this.client.permission.findMany({
      where: { key: { in: keys } },
    })
  }

  async updateById(id: string, data: Prisma.PermissionUpdateInput): Promise<Permission> {
    return this.client.permission.update({ where: { id }, data })
  }

  async deleteById(id: string): Promise<Permission> {
    return this.client.permission.delete({ where: { id } })
  }

  async countRoleLinks(permissionId: string): Promise<number> {
    return this.client.rolePermission.count({ where: { permissionId } })
  }
}
