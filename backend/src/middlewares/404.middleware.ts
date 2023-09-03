import { NextFunction, Request, Response } from 'express';

const pageNotFoundMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    statu: 404,
    success: true,
    message: `${req.method} '${req.url}' not found`,
  });
};

export default pageNotFoundMiddleware;
