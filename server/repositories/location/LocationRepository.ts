import { prisma } from '../../lib/prisma';
import type { PrismaClient, Location } from '@prisma/client';
import { ILocationRepository } from '../../interfaces/repositories/ILocationRepository';

export class LocationRepository implements ILocationRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Location[]> {
    return this.client.location.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Location | null> {
    return this.client.location.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Location | null> {
    return this.client.location.findUnique({ where: { name } });
  }
}
