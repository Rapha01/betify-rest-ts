import { Router } from 'express';
import { memberController } from '../controllers/member.controller';
import { validate } from '../middlewares/validation.middleware';
import { memberValidator } from '../validators/member.validator';

const router = Router();


router.get(
  '/game/:gameId',
  validate(memberValidator.getByGameId),
  memberController.getMembersByGameId
);

router.put(
  '/account/:accountId/game/:gameId',
  validate(memberValidator.updateByAccountAndGame),
  memberController.updateMember
);


export default router;
