import { Request } from 'express';

export const gameValidator = {
  create(req: Request): string {
    const { title } = req.body;
    if (!title) return 'Title is required.';
    return '';
  },
  update(req: Request): string {
    const { field, value } = req.body;
    const allowedFields = ['title', 'description', 'banner_url', 'currency_name', 'language', 'is_active', 'is_public', 'start_currency'];
    if (!field) return 'Field is required.';
    if (!allowedFields.includes(field)) return 'Invalid field for update.';
    if (value === undefined || value === null) return 'Value is required.';
    return '';
  },
  getById(req: Request): string {
    if (!req.params.id) return 'Game ID is required.';
    return '';
  },
  getByAccountId(req: Request): string {
    if (!req.params.accountId) return 'Account ID is required.';
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 9;
    if (page < 1) return 'Page must be greater than 0.';
    if (limit < 1 || limit > 100) return 'Limit must be between 1 and 100.';
    return '';
  }
};
