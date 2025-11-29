import { Request } from 'express';

export const accountValidator = {
  create(req: Request): string {
    const { username, email } = req.body;
    if (!username) return 'Username is required.';
    if (!email) return 'Email is required.';
    return '';
  },
  update(req: Request): string {
    const allowedFields = ['username', 'avatar_url', 'currentPassword', 'newPassword'];
    const bodyFields = Object.keys(req.body);
    
    if (bodyFields.length === 0) return 'At least one field to update is required.';
    
    // Check if password change is requested
    const hasCurrentPassword = 'currentPassword' in req.body;
    const hasNewPassword = 'newPassword' in req.body;
    
    // If changing password, both fields must be present
    if (hasCurrentPassword || hasNewPassword) {
      if (!hasCurrentPassword) return 'Current password is required when changing password.';
      if (!hasNewPassword) return 'New password is required when changing password.';
      if (!req.body.currentPassword || typeof req.body.currentPassword !== 'string') return 'Valid current password is required.';
      if (!req.body.newPassword || typeof req.body.newPassword !== 'string') return 'Valid new password is required.';
      if (req.body.newPassword.length < 6) return 'New password must be at least 6 characters long.';
    }
    
    for (const field of bodyFields) {
      if (!allowedFields.includes(field)) return `Invalid field for update: ${field}`;
      if (field !== 'currentPassword' && field !== 'newPassword') {
        if (req.body[field] === undefined || req.body[field] === null) return `Value for ${field} is required.`;
        if (field === 'username' && (!req.body[field] || typeof req.body[field] !== 'string')) return 'Valid username is required.';
        if (field === 'avatar_url' && (!req.body[field] || typeof req.body[field] !== 'string')) return 'Valid avatar URL is required.';
      }
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