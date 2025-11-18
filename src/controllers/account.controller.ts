import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models/account.model';
import { UpdateAccountDto } from '../types/account';
import ApiError from '../utils/ApiError';
import { httpStatus } from '../utils/httpStatus';

class AccountController {
  async getAccountById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const account = await AccountModel.findById(id);
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    res.json(account);
  }

  async createAccount(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, role } = req.body;
    await AccountModel.create({ username, email, password });
    res.status(201).json({ message: 'Account created' });
  }

  async updateAccount(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const accountId = req.account!.id;

    if (id !== accountId && req.account!.role !== 'admin') 
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You can only update your own profile');
    
    const allowedFields: (keyof Omit<UpdateAccountDto, 'id'>)[] = ['username', 'password'];

    const updates: Partial<Omit<UpdateAccountDto, 'id'>> = {};
    allowedFields.forEach(field => { if (req.body[field] !== undefined) { updates[field] = req.body[field]; } });

    if (Object.keys(updates).length === 0) 
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    
    const updated = await AccountModel.update(id, updates);
    if (!updated) 
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    
    res.json({ message: 'Account updated' });
  }
}

export const accountController = new AccountController();