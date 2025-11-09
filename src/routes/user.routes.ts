import { Router } from 'express';
import {
  userController
} from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { userValidator } from '../validators/user.validator';

const router = Router();

router.get(
  '/',
  userController.getUsers
);

router.get(
  '/:id',
  validate(userValidator.getById),
  userController.getUserById
);

router.post(
  '/',
  validate(userValidator.create),
  userController.createUser
);

router.put(
  '/:id',
  validate(userValidator.update),
  userController.updateUser
);

router.delete(
  '/:id',
  validate(userValidator.deleteById),
  userController.deleteUser
);

export default router;
