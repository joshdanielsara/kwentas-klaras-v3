import { ServiceRepository } from '../../repositories/service/ServiceRepository'
import { ServiceSerializer } from '../../serializers/ServiceSerializer'
import type { PrismaClient } from '@prisma/client'
import {
  normalizeCatalogName,
  validateCatalogName,
} from '../../../app/utils/catalog/normalizeCatalogName'

export class ServiceService {
  private repo: ServiceRepository

  constructor(prismaClient?: PrismaClient) {
    this.repo = new ServiceRepository(prismaClient)
  }

  async list() {
    const services = await this.repo.findAll()
    return ServiceSerializer.list(services)
  }

  async get(id: string) {
    const service = await this.repo.findById(id)
    return ServiceSerializer.detail(service)
  }

  async create(name: string) {
    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const existing = await this.repo.findByName(normalized)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Service already exists' })
    }

    const service = await this.repo.create({ name: normalized })
    return ServiceSerializer.detail(service)
  }

  async update(id: string, name: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Service not found' })
    }

    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const duplicate = await this.repo.findByName(normalized)
    if (duplicate && duplicate.id !== id) {
      throw createError({ statusCode: 409, message: 'Service already exists' })
    }

    const service = await this.repo.updateById(id, { name: normalized })
    return ServiceSerializer.detail(service)
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Service not found' })
    }
    await this.repo.deleteById(id)
    return { success: true }
  }
}
