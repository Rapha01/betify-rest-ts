import { Router } from 'express';
import {
  accountController
} from '../controllers/account.controller';
import { validate } from '../middlewares/validation.middleware';
import { accountValidator } from '../validators/account.validator';

const router = Router();

router.get(
  '/:id',
  validate(accountValidator.getById),
  accountController.getAccountById
);

router.post(
  '/',
  validate(accountValidator.create),
  accountController.createAccount
);

router.put(
  '/:id',
  validate(accountValidator.update),
  accountController.updateAccount
);

export default router;