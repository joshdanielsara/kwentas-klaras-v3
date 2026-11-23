import type { PrismaClient, RolePermission } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { IRolePermissionRepository } from '../../interfaces/repositories/IRolePermissionRepository'

export class RolePermissionRepository implements IRolePermissionRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async findPermissionIdsByRoleId(roleId: string): Promise<string[]> {
    const links = await this.client.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    })
    return links.map((link) => link.permissionId)
  }

  async findByRoleId(roleId: string): Promise<RolePermission[]> {
    return this.client.rolePermission.findMany({ where: { roleId } })
  }

  async replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await this.client.rolePermission.deleteMany({ where: { roleId } })
    if (permissionIds.length === 0) {
      return
    }

    for (const permissionId of permissionIds) {
      await this.client.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      })
    }
  }

  async deleteByRoleId(roleId: string): Promise<void> {
    await this.client.rolePermission.deleteMany({ where: { roleId } })
  }

  async deleteByPermissionId(permissionId: string): Promise<void> {
    await this.client.rolePermission.deleteMany({ where: { permissionId } })
  }
}
