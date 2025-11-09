import { Request } from 'express';

export const userValidator = {
  create(req: Request): string {
    const { username, email } = req.body;
    if (!username) return 'Username is required.';
    if (!email) return 'Email is required.';
    return '';
  },
  update(req: Request): string {
    const { field, value } = req.body;
    if (!field) return 'Field is required.';
    if (field !== 'password') return 'Only password can be updated.';
    if (!value || typeof value !== 'string') return 'Valid value is required.';
    return '';
  },
  getById(req: Request): string {
    if (!req.params.id) return 'User ID is required.';
    return '';
  },
  deleteById(req: Request): string {
    if (!req.params.id) return 'User ID is required.';
    return '';
  }
};
