import type { Location, Prisma } from '@prisma/client'

export interface ILocationRepository {
  findAll(): Promise<Location[]>
  findById(id: string): Promise<Location | null>
  findByName(name: string): Promise<Location | null>
  create(data: Prisma.LocationCreateInput): Promise<Location>
  updateById(id: string, data: Prisma.LocationUpdateInput): Promise<Location>
  deleteById(id: string): Promise<Location>
}
