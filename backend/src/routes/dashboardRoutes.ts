import express from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard KPIs and recent data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data including KPIs and recent items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kpis:
 *                   type: object
 *                   properties:
 *                     totalProjects:
 *                       type: integer
 *                     totalSkills:
 *                       type: integer
 *                     totalResumes:
 *                       type: integer
 *                 recentProjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 recentSkills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [backend, frontend, database, other]
 *                       imageUrl:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', dashboardController.getDashboardData);

export default router; 