import { ObligationService } from '../../../services/obligation/ObligationService';
import { withErrorHandler } from '../../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId');

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required',
    });
  }

  return await withErrorHandler(async () => {
    const obligationService = new ObligationService();
    const obligations = await obligationService.findByProject(projectId);

    return {
      success: true,
      obligations,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch obligations',
  });
});

