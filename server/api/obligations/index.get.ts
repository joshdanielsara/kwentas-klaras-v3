import { ObligationService } from '../../services/obligation/ObligationService';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const obligationService = new ObligationService();
    const obligations = await obligationService.list();

    return {
      success: true,
      obligations,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch obligations',
  });
});

