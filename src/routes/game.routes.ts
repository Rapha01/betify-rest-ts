import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { validate } from '../middlewares/validation.middleware';
import { gameValidator } from '../validators/game.validator';

const router = Router();

router.get(
  '/',
  gameController.getGames
);

router.get(
  '/:id',
  validate(gameValidator.getById),
  gameController.getGameById
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

router.delete(
  '/:id',
  validate(gameValidator.deleteById),
  gameController.deleteGame
);

export default router;
