import { DepartmentRepository } from '../../repositories/department/DepartmentRepository'
import { DepartmentSerializer } from '../../serializers/DepartmentSerializer'
import type { PrismaClient } from '@prisma/client'
import {
  normalizeCatalogName,
  validateCatalogName,
} from '../../../app/utils/catalog/normalizeCatalogName'

export class DepartmentService {
  private repo: DepartmentRepository

  constructor(prismaClient?: PrismaClient) {
    this.repo = new DepartmentRepository(prismaClient)
  }

  async list() {
    const departments = await this.repo.findAll()
    return DepartmentSerializer.list(departments)
  }

  async get(id: string) {
    const department = await this.repo.findById(id)
    return DepartmentSerializer.detail(department)
  }

  async create(name: string) {
    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const existing = await this.repo.findByName(normalized)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Implementing unit already exists' })
    }

    const department = await this.repo.create({ name: normalized })
    return DepartmentSerializer.detail(department)
  }

  async update(id: string, name: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Implementing unit not found' })
    }

    const normalized = normalizeCatalogName(name)
    const validationError = validateCatalogName(normalized)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const duplicate = await this.repo.findByName(normalized)
    if (duplicate && duplicate.id !== id) {
      throw createError({ statusCode: 409, message: 'Implementing unit already exists' })
    }

    const department = await this.repo.updateById(id, { name: normalized })
    return DepartmentSerializer.detail(department)
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Implementing unit not found' })
    }
    await this.repo.deleteById(id)
    return { success: true }
  }
}
