export interface CreateObligationRequest {
  projectId: string;
  amount: number;
  reason: string;
  payee: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

