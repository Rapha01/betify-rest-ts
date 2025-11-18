import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';


export const attachAccount = (req: Request, _res: Response, next: NextFunction) => {
  console.log('/Request to ' + JSON.stringify(req.url));
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.account = decoded; // Attach account info to request
    console.log('\\Request from ' + JSON.stringify(decoded.username));
  } catch (error) {
  }
  return next();
};

export default attachAccount;