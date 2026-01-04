import { ObligationService } from '../../services/obligation/ObligationService';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Obligation ID is required',
    });
  }

  return await withErrorHandler(async () => {
    const obligationService = new ObligationService();
    const obligation = await obligationService.get(id);

    if (!obligation) {
      throw createError({
        statusCode: 404,
        message: 'Obligation not found',
      });
    }

    return {
      success: true,
      obligation,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch obligation',
  });
});

