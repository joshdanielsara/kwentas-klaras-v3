import type { Prisma, Role } from '@prisma/client'

export interface IRoleRepository {
  create(data: Prisma.RoleCreateInput): Promise<Role>
  findAll(): Promise<Role[]>
  findById(id: string): Promise<Role | null>
  findBySlug(slug: string): Promise<Role | null>
  updateById(id: string, data: Prisma.RoleUpdateInput): Promise<Role>
  deleteById(id: string): Promise<Role>
  countUsersBySlug(slug: string): Promise<number>
}
