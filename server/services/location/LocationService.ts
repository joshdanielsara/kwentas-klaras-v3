import { LocationRepository } from '../../repositories/location/LocationRepository';
import { LocationSerializer } from '../../serializers/LocationSerializer';
import type { PrismaClient } from '@prisma/client';

export class LocationService {
  private repo: LocationRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new LocationRepository(prismaClient);
  }

  async list() {
    const locations = await this.repo.findAll();
    return LocationSerializer.list(locations);
  }

  async get(id: string) {
    const location = await this.repo.findById(id);
    return LocationSerializer.detail(location);
  }
}
