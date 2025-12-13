import type { Prisma, Location } from '@prisma/client';

export interface ILocationRepository {
  findAll(): Promise<Location[]>;
  findById(id: string): Promise<Location | null>;
  findByName(name: string): Promise<Location | null>;
}
