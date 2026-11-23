import type { Department, Prisma } from '@prisma/client'

export interface IDepartmentRepository {
  findAll(): Promise<Department[]>
  findById(id: string): Promise<Department | null>
  findByName(name: string): Promise<Department | null>
  create(data: Prisma.DepartmentCreateInput): Promise<Department>
  updateById(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department>
  deleteById(id: string): Promise<Department>
}
