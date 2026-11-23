import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Location } from '@prisma/client';
import { ILocationRepository } from '../../interfaces/repositories/ILocationRepository';

export class LocationRepository implements ILocationRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.client.location.findMany();
    return locations.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Location | null> {
    return this.client.location.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Location | null> {
    return this.client.location.findUnique({ where: { name } });
  }

  async create(data: Prisma.LocationCreateInput): Promise<Location> {
    return this.client.location.create({ data });
  }

  async updateById(id: string, data: Prisma.LocationUpdateInput): Promise<Location> {
    return this.client.location.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Location> {
    return this.client.location.delete({ where: { id } });
  }
}
