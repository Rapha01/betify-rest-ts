import { Router } from 'express';
import { betController } from '../controllers/bet.controller';
import { validate } from '../middlewares/validation.middleware';
import { betValidator } from '../validators/bet.validator';

const router = Router();

router.get(
  '/game/:gameId',
  betController.getBetsByGameId
);

router.get(
  '/slug/:slug',
  betController.getBetBySlug
);

router.get(
  '/:id',
  betController.getBetById
);

router.post(
  '/game/:gameId',
  validate(betValidator.create),
  betController.createBet
);

router.put(
  '/:id',
  validate(betValidator.update),
  betController.updateBet
);

router.delete(
  '/:id',
  betController.deleteBet
);

export default router;
