import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';


export const attachAccount = (req: Request, _res: Response, next: NextFunction) => {
  console.log('/Request to ' + JSON.stringify(req.url));
  
  // Get token from HTTP-only cookie
  const token = req.cookies?.['auth-token'];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.account = decoded; // Attach account info to request
    console.log('\\Request from ' + JSON.stringify(decoded.username));
  } catch (error) {
    console.log('Invalid JWT token:', error instanceof Error ? error.message : 'Unknown error');
  }
  return next();
};

export default attachAccount;