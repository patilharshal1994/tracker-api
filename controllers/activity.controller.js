import ActivityService from '../src/services/ActivityService.js';
import { uuidParamValidation, paginationValidation } from '../src/validators/common.validator.js';
import { validate } from '../src/validators/auth.validator.js';

export const getTicketActivities = async (req, res, next) => {
  try {
    const result = await ActivityService.getTicketActivities(req.params.ticketId, req.query);
    // Frontend expects response.data.data for array
    res.json({
      data: result.data || result
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketActivitiesValidation = validate([
  uuidParamValidation('ticketId'),
  ...paginationValidation
]);
