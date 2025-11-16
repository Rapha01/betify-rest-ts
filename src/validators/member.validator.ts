import { Request } from 'express';

export const memberValidator = {
  updateByAccountAndGame(req: Request): string {
    const requestedFields = Object.keys(req.body);

    if (requestedFields.length === 0) {
      return 'At least one field to update is required.';
    }

    if (requestedFields.length > 1) {
      return 'Only one field can be updated at a time.';
    }

    const field = requestedFields[0];
    const value = req.body[field];

    if (field === 'is_banned') {
      if (typeof value !== 'boolean') {
        return 'is_banned must be a boolean.';
      }
    } else if (field === 'is_favorited') {
      if (typeof value !== 'boolean') {
        return 'is_favorited must be a boolean.';
      }
    } else if (field === 'is_moderator') {
      if (typeof value !== 'boolean') {
        return 'is_moderator must be a boolean.';
      }
    } else {
      return 'Invalid field for update. Only is_banned or is_favorited or is_moderator can be updated.';
    }

    return '';
  },
  getByGameId(req: Request): string {
    if (!req.params.gameId) return 'Game ID is required.';
    return '';
  },
  getByGameAndAccountId(req: Request): string {
    if (!req.params.gameId) return 'Game ID is required.';
    if (!req.params.accountId) return 'Account ID is required.';
    return '';
  },
};