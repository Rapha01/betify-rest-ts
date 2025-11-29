import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { authValidator } from '../validators/auth.validator';

const router = Router();

router.post(
    '/register', 
    validate(authValidator.register), 
    authController.register
);

router.post(
    '/verify-email-code', 
    validate(authValidator.verifyEmailCode), 
    authController.verifyEmailCode
);

router.post(
    '/login', 
    validate(authValidator.login), 
    authController.login
);

router.post(
    '/logout', 
    authController.logout
);

router.post(
    '/reset-password', 
    validate(authValidator.resetPassword), 
    authController.resetPassword
);

router.get(
    '/me',
    authController.getCurrentAccount
);

export default router;
