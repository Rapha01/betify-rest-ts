import { Router } from 'express';
import authRoutes from './authRoutes';
// Import other route files here as needed

const router: Router = Router();

router.use('/auth', authRoutes);
// Add other routes here, e.g.:
// router.use('/users', userRoutes);

export default router;
