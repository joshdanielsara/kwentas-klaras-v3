import type { Obligation } from '@prisma/client';

export class ObligationSerializer {
  static formatObligation(obligation: Obligation) {
    return {
      id: obligation.id,
      projectId: obligation.projectId,
      amount: obligation.amount,
      reason: obligation.reason,
      payee: obligation.payee,
      approvedBy: obligation.approvedBy,
      approvedDate: obligation.approvedDate,
      status: obligation.status,
      createdAt: obligation.createdAt,
      updatedAt: obligation.updatedAt,
    };
  }

  static list(obligations: Obligation[]) {
    return obligations.map(obligation => this.formatObligation(obligation));
  }

  static detail(obligation: Obligation | null) {
    return obligation ? this.formatObligation(obligation) : null;
  }
}

