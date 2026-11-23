import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Department } from '@prisma/client';
import { IDepartmentRepository } from '../../interfaces/repositories/IDepartmentRepository';

export class DepartmentRepository implements IDepartmentRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Department[]> {
    const departments = await this.client.department.findMany();
    return departments.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { name } });
  }

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return this.client.department.create({ data });
  }

  async updateById(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    return this.client.department.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<Department> {
    return this.client.department.delete({ where: { id } });
  }
}
