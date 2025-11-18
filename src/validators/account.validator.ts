import { Request } from 'express';

export const accountValidator = {
  create(req: Request): string {
    const { username, email } = req.body;
    if (!username) return 'Username is required.';
    if (!email) return 'Email is required.';
    return '';
  },
  update(req: Request): string {
    const allowedFields = ['username', 'password'];
    const bodyFields = Object.keys(req.body);
    
    if (bodyFields.length === 0) return 'At least one field to update is required.';
    
    for (const field of bodyFields) {
      if (!allowedFields.includes(field)) return `Invalid field for update: ${field}`;
      if (req.body[field] === undefined || req.body[field] === null) return `Value for ${field} is required.`;
      if (field === 'password' && (!req.body[field] || typeof req.body[field] !== 'string')) return 'Valid password is required.';
      if (field === 'username' && (!req.body[field] || typeof req.body[field] !== 'string')) return 'Valid username is required.';
    }
    
    return '';
  },
  getById(req: Request): string {
    if (!req.params.id) return 'Account ID is required.';
    return '';
  },
  deleteById(req: Request): string {
    if (!req.params.id) return 'Account ID is required.';
    return '';
  }
};