import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

// General validation middleware factory
// Accepts a custom validator function for each route
export function validate(validator: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errorMessage = validator(req);
    if (errorMessage != '') 
      return next(new ApiError(400, errorMessage));
    next();
  };
}
