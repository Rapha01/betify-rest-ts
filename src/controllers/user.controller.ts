import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import ApiError from '../utils/ApiError';

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await UserModel.findAll();
    res.json(users);
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json(user);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, role } = req.body;
    const user = await UserModel.create({ username, email, password });
    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { field, value } = req.body;

    if (field !== 'password') {
      throw new ApiError(400, 'Only password can be updated');
    }

    if (!value || typeof value !== 'string') {
      throw new ApiError(400, 'Invalid value');
    }

    const user = await UserModel.updatePassword(id, value);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json(user);
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const deleted = await UserModel.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'User not found');
    }
    res.json({ message: 'User deleted' });
  }
}

export const userController = new UserController();
