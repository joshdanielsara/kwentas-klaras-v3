import type { Prisma, Department } from '@prisma/client';

export interface IDepartmentRepository {
  findAll(): Promise<Department[]>;
  findById(id: string): Promise<Department | null>;
  findByName(name: string): Promise<Department | null>;
}
