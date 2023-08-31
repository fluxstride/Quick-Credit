import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 *
 * @param callback the async function to wrapped
 * @returns an async route handler function with error handling
 */
const asyncWrap = (callback: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncWrap;
