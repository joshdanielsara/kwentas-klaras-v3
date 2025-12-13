import { RemarkRepository } from '../../repositories/remark/RemarkRepository';
import { RemarkSerializer } from '../../serializers/RemarkSerializer';
import type { PrismaClient } from '@prisma/client';

export class RemarkService {
  private repo: RemarkRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new RemarkRepository(prismaClient);
  }

  async list() {
    const remarks = await this.repo.findAll();
    return RemarkSerializer.list(remarks);
  }

  async get(id: string) {
    const remark = await this.repo.findById(id);
    return RemarkSerializer.detail(remark);
  }
}
