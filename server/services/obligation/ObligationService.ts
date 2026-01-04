import { ObligationRepository } from '../../repositories/obligation/ObligationRepository';
import { ObligationSerializer } from '../../serializers/ObligationSerializer';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class ObligationService {
  private repo: ObligationRepository;
  private client: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma;
    this.repo = new ObligationRepository(prismaClient);
  }

  async list() {
    const obligations = await this.repo.findAll();
    return ObligationSerializer.list(obligations);
  }

  async get(id: string) {
    const obligation = await this.repo.findById(id);
    return ObligationSerializer.detail(obligation);
  }

  async findByProject(projectId: string) {
    const obligations = await this.repo.findByProjectId(projectId);
    return ObligationSerializer.list(obligations);
  }

  async create(data: {
    projectId: string;
    amount: number;
    reason: string;
    payee: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!data.payee || data.payee.trim() === '') {
      throw new Error('Payee is required');
    }

    const obligation = await this.repo.create({
      projectId: data.projectId,
      amount: data.amount,
      reason: data.reason.trim(),
      payee: data.payee.trim(),
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
      status: data.status || 'pending',
    });

    return ObligationSerializer.detail(obligation);
  }
}

