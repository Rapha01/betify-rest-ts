import { Request } from 'express';

export const authValidator = {
  register(req: Request): string {
    const { email, password } = req.body;
    if (!email) return 'Email is required.';
    if (!password) return 'Password is required.';
    return '';
  },
  login(req: Request): string {
    const { email, password } = req.body;
    if (!email) return 'Email is required.';
    if (!password) return 'Password is required.';
    return '';
  },
  resetPassword(req: Request): string {
    const { email, newPassword } = req.body;
    if (!email) return 'Email is required.';
    if (!newPassword) return 'New password is required.';
    return '';
  },
  verifyEmailCode(req: Request): string {
    const { email, code } = req.body;
    if (!email) return 'Email is required.';
    if (!code) return 'Verification code is required.';
    return '';
  }
};
