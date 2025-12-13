import type { Prisma, Remark } from '@prisma/client';

export interface IRemarkRepository {
  findAll(): Promise<Remark[]>;
  findById(id: string): Promise<Remark | null>;
  findByName(name: string): Promise<Remark | null>;
}
