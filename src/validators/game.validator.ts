import { Request } from 'express';

export const gameValidator = {
  create(req: Request): string {
    const { name, genre, releaseDate } = req.body;
    if (!name) return 'Name is required.';
    if (!genre) return 'Genre is required.';
    if (!releaseDate) return 'Release date is required.';
    return '';
  },
  update(req: Request): string {
    const { field, value } = req.body;
    const allowedFields = ['name', 'genre', 'releaseDate'];
    if (!field) return 'Field is required.';
    if (!allowedFields.includes(field)) return 'Invalid field for update.';
    if (value === undefined || value === null) return 'Value is required.';
    return '';
  },
  getById(req: Request): string {
    if (!req.params.id) return 'Game ID is required.';
    return '';
  },
  deleteById(req: Request): string {
    if (!req.params.id) return 'Game ID is required.';
    return '';
  }
};
