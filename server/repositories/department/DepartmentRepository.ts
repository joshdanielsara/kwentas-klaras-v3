import { prisma } from '../../lib/prisma';
import type { PrismaClient, Department } from '@prisma/client';
import { IDepartmentRepository } from '../../interfaces/repositories/IDepartmentRepository';

export class DepartmentRepository implements IDepartmentRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async findAll(): Promise<Department[]> {
    return this.client.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Department | null> {
    return this.client.department.findUnique({ where: { name } });
  }
}
