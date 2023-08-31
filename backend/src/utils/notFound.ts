import { Response } from 'express';

/**
 *
 * @param response respone object
 * @param resource the resource not found - optional
 */
function notFound(response: Response, resource = 'resource') {
  response
    .status(404)
    .json({ message: `${resource} not found`, success: true });
}

export default notFound;
