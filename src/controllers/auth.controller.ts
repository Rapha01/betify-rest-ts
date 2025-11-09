import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email, and password are required.');
    }
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new ApiError(409, 'Username already exists.');
    }
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(409, 'Email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  }

  async verifyEmailCode(req: Request, res: Response, next: NextFunction) {
    const { email, code } = req.body;
    if (!email || !code) {
      throw new ApiError(400, 'Email and code are required.');
    }
    // TODO: Implement actual code verification logic (e.g., check DB or cache)
    // For now, just a stub response
    if (code === '123456') { // Example: always accept '123456' as valid
      res.status(200).json({ message: 'Email verified successfully.' });
    } else {
      throw new ApiError(400, 'Invalid verification code.');
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required.');
    }
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials.');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(401, 'Invalid credentials.');
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: `${config.jwt.accessExpirationMinutes}m` }
    );
    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
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
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    res.status(200).json({ user: req.user });
  }
}

export const authController = new AuthController();


