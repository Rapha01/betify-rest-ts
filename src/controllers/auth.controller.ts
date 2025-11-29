import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models/account.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username, email, and password are required.');
    }
    const existingAccount = await AccountModel.findByUsername(username);
    if (existingAccount) {
      throw new ApiError(httpStatus.CONFLICT, 'Username already exists.');
    }
    const existingEmail = await AccountModel.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await AccountModel.create({ username, email, password: hashedPassword });
    const createdAccount = await AccountModel.findByUsername(username);
    res.status(201).json({ message: 'Account registered successfully', account: createdAccount });
  }

  verifyEmailCode = async (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;
    if (!email || !code) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email and code are required.');
    }
    // TODO: Implement actual code verification logic (e.g., check DB or cache)
    // For now, just a stub response
    if (code === '123456') { // Example: always accept '123456' as valid
      res.status(200).json({ message: 'Email verified successfully.' });
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification code.');
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const account = await AccountModel.findByEmail(email);
    if (!account) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials.');
    }
    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials.');
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: account.id, username: account.username, email: account.email, role: account.role, avatar_url: account.avatar_url },
      config.jwt.secret,
      { expiresIn: `${config.jwt.accessExpirationMinutes}m` }
    );
    
    // Set HTTP-only cookie
    const cookieMaxAge = config.jwt.accessExpirationMinutes * 60 * 1000; // Convert minutes to milliseconds
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: config.env === 'prod', // Only use secure cookies in production (HTTPS)
      sameSite: 'strict',
      maxAge: cookieMaxAge
    });
    
    // Return account info (but NOT the token - it's in the cookie now)
    res.status(200).json({ 
      message: 'Login successful', 
      account: { 
        id: account.id, 
        username: account.username, 
        email: account.email, 
        role: account.role, 
        avatar_url: account.avatar_url 
      }
    });
  }

  logout = async (_req: Request, res: Response, next: NextFunction) => {
    // Clear the auth-token cookie
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: config.env === 'prod',
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    // This is a stub. Implement token/email logic as needed.
    res.status(200).json({ message: 'Password reset instructions sent (stub)' });
  }

  getCurrentAccount = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    
    // Fetch fresh account data from database to get latest updates (like avatar_url)
    const account = await AccountModel.findById(req.account.id);
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    res.status(200).json({ account });
  }
}

export const authController = new AuthController();


