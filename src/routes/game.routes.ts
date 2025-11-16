import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { validate } from '../middlewares/validation.middleware';
import { gameValidator } from '../validators/game.validator';

const router = Router();

router.get(
  '/account/:accountId',
  validate(gameValidator.getByAccountId),
  gameController.getGamesByAccountId
);

router.get(
  '/:id',
  validate(gameValidator.getById),
  gameController.getGameById
);

router.get(
  '/favorites/:accountId',
  validate(gameValidator.getByAccountId),
  gameController.getFavoriteGamesByAccountId
);

router.post(
  '/',
  validate(gameValidator.create),
  gameController.createGame
);

router.put(
  '/:id',
  validate(gameValidator.update),
  gameController.updateGame
);

export default router;
