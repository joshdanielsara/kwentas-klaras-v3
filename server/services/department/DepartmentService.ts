import { DepartmentRepository } from '../../repositories/department/DepartmentRepository';
import { DepartmentSerializer } from '../../serializers/DepartmentSerializer';
import type { PrismaClient } from '@prisma/client';

export class DepartmentService {
  private repo: DepartmentRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new DepartmentRepository(prismaClient);
  }

  async list() {
    const departments = await this.repo.findAll();
    return DepartmentSerializer.list(departments);
  }

  async get(id: string) {
    const department = await this.repo.findById(id);
    return DepartmentSerializer.detail(department);
  }
}
