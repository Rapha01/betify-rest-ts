import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models/account.model';
import { UpdateAccountDto } from '../types/account';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';
import bcrypt from 'bcrypt';

class AccountController {
  getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const account = await AccountModel.findById(id);
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    res.json(account);
  }

  createAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, role } = req.body;
    await AccountModel.create({ username, email, password });
    res.status(201).json({ message: 'Account created' });
  }

  updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to update an account');
    
    const accountId = req.account.id;

    if (id !== accountId && req.account.role !== 'admin') 
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You can only update your own profile');
    
    // Check if this is a password change request
    if (req.body.currentPassword && req.body.newPassword) {
      // Redirect to password change logic
      return this.changePassword(req, res, next);
    }
    
    // Handle regular profile updates
    const allowedFields: (keyof Omit<UpdateAccountDto, 'id'>)[] = ['username', 'avatar_url'];

    const updates: Partial<Omit<UpdateAccountDto, 'id'>> = {};
    allowedFields.forEach(field => { if (req.body[field] !== undefined) { updates[field] = req.body[field]; } });

    if (Object.keys(updates).length === 0) 
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    
    const updated = await AccountModel.update(id, updates);
    if (!updated) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    
    res.json({ message: 'Account updated' });
  }

  private changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!req.account) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You must be logged in to change password');
    
    const accountId = req.account.id;
    const { currentPassword, newPassword } = req.body;

    // Only allow users to change their own password
    if (id !== accountId) 
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You can only change your own password');

    // Get the account with password
    const account = await AccountModel.findByIdWithPassword(id);
    if (!account) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, account.password);
    if (!isValid) 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updated = await AccountModel.update(id, { password: hashedPassword });
    if (!updated) 
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update password');

    res.json({ message: 'Password changed successfully' });
  }
}

export const accountController = new AccountController();