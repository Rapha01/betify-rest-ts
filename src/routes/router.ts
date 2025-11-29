import { Router } from 'express';
import authRoutes from './auth.routes';
import accountRoutes from './account.routes';
import gameRoutes from './game.routes';
import memberRoutes from './member.routes';
import betRoutes from './bet.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/game', gameRoutes);
router.use('/member', memberRoutes);
router.use('/bet', betRoutes);


export default router;
