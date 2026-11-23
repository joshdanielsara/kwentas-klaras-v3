import type { Prisma, PrismaClient, Role } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { IRoleRepository } from '../../interfaces/repositories/IRoleRepository'

export class RoleRepository implements IRoleRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.client.role.create({ data })
  }

  async findAll(): Promise<Role[]> {
    return this.client.role.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string): Promise<Role | null> {
    return this.client.role.findUnique({ where: { id } })
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return this.client.role.findUnique({ where: { slug } })
  }

  async updateById(id: string, data: Prisma.RoleUpdateInput): Promise<Role> {
    return this.client.role.update({ where: { id }, data })
  }

  async deleteById(id: string): Promise<Role> {
    return this.client.role.delete({ where: { id } })
  }

  async countUsersBySlug(slug: string): Promise<number> {
    return this.client.user.count({
      where: {
        role: slug,
        deletedAt: null,
      },
    })
  }
}
