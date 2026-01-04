import { ObligationService } from '../../services/obligation/ObligationService';
import { withErrorHandler } from '../../utils/errorHandler';
import type { CreateObligationRequest } from '../../types/obligation/createObligationRequest';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateObligationRequest>(event);

  if (!body.projectId || !body.amount || !body.reason || !body.payee) {
    throw createError({
      statusCode: 400,
      message: 'projectId, amount, reason, and payee are required',
    });
  }

  return await withErrorHandler(async () => {
    const obligationService = new ObligationService();
    const obligation = await obligationService.create({
      projectId: body.projectId,
      amount: body.amount,
      reason: body.reason,
      payee: body.payee,
      approvedBy: body.approvedBy,
      approvedDate: body.approvedDate,
      status: body.status,
    });

    return {
      success: true,
      obligation,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create obligation',
  });
});

