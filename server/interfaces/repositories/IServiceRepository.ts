import type { Prisma, Service } from '@prisma/client'

export interface IServiceRepository {
  findAll(): Promise<Service[]>
  findById(id: string): Promise<Service | null>
  findByName(name: string): Promise<Service | null>
  create(data: Prisma.ServiceCreateInput): Promise<Service>
  updateById(id: string, data: Prisma.ServiceUpdateInput): Promise<Service>
  deleteById(id: string): Promise<Service>
}
