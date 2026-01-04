export interface IObligation {
  id?: string;
  projectId: string;
  amount: number;
  reason: string;
  payee: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

