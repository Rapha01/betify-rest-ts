import { Router } from 'express';
import authRoutes from './auth.routes';
import gameRoutes from './game.routes';
import userRoutes from './user.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/users', userRoutes);


export default router;
