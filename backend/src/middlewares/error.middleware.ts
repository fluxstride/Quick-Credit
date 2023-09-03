import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';

const errorMiddleware = (
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  return res.status(err.status || 500).json({
    status: 500,
    success: false,
    message: err.message || 'something went wrong',
  });
};

export default errorMiddleware;
