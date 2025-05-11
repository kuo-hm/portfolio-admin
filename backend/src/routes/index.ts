import { Router } from 'express';
import projectRoutes from './projectRoutes';
import skillRoutes from './skillRoutes';
import resumeRoutes from './resumeRoutes';

const router = Router();


router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/resumes', resumeRoutes);

export default router; 