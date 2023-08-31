/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

function validation(schema: Joi.Schema) {
  return async function validationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const validationOptions: Joi.AsyncValidationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      next();
    } catch (error) {
      const validationErrors: string[] = [];

      error.details.forEach((validationError: Joi.ValidationError) =>
        validationErrors.push(validationError.message),
      );

      res.status(400).json({
        status: 400,
        success: false,
        validationErrors,
      });
    }
  };
}

export default validation;
