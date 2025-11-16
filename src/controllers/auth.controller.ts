import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models/account.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
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

  async verifyEmailCode(req: Request, res: Response, next: NextFunction) {
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

  async login(req: Request, res: Response, next: NextFunction) {
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
      { id: account.id, username: account.username, email: account.email, role: account.role, avatarUrl: account.avatarUrl },
      config.jwt.secret,
      { expiresIn: `${config.jwt.accessExpirationMinutes}m` }
    );
    res.status(200).json({ message: 'Login successful', account: { id: account.id, username: account.username, email: account.email, role: account.role, avatarUrl: account.avatarUrl }, token });
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
    // For stateless JWT, just respond OK. For sessions, destroy session here.
    res.status(200).json({ message: 'Logged out successfully' });
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    // This is a stub. Implement token/email logic as needed.
    res.status(200).json({ message: 'Password reset instructions sent (stub)' });
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    if (!req.account) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    res.status(200).json({ account: req.account });
  }
}

export const authController = new AuthController();


