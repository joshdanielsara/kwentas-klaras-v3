import { LocationRepository } from '../../repositories/location/LocationRepository'
import { LocationSerializer } from '../../serializers/LocationSerializer'
import type { PrismaClient } from '@prisma/client'
import {
  normalizeCatalogName,
  validateCatalogName,
} from '../../../app/utils/catalog/normalizeCatalogName'

export class LocationService {
  private repo: LocationRepository

  constructor(prismaClient?: PrismaClient) {
    this.repo = new LocationRepository(prismaClient)
  }

  async list() {
    const locations = await this.repo.findAll()
    return LocationSerializer.list(locations)
  }

  async get(id: string) {
    const location = await this.repo.findById(id)
    return LocationSerializer.detail(location)
  }

  async create(name: string) {
    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const existing = await this.repo.findByName(normalized)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Barangay already exists' })
    }

    const location = await this.repo.create({ name: normalized })
    return LocationSerializer.detail(location)
  }

  async update(id: string, name: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Barangay not found' })
    }

    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const duplicate = await this.repo.findByName(normalized)
    if (duplicate && duplicate.id !== id) {
      throw createError({ statusCode: 409, message: 'Barangay already exists' })
    }

    const location = await this.repo.updateById(id, { name: normalized })
    return LocationSerializer.detail(location)
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Barangay not found' })
    }
    await this.repo.deleteById(id)
    return { success: true }
  }
}
