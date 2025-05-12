import express from 'express';
import { publicController } from '../controllers/publicController';

const router = express.Router();

/**
 * @swagger
 * /public/projects:
 *   get:
 *     summary: Get all public projects with pagination
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of public projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
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
 *                       websiteLink:
 *                         type: string
 *                       githubLink:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of items
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       description: Items per page
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *       500:
 *         description: Internal server error
 */
router.get('/projects', publicController.getPublicProjects);

/**
 * @swagger
 * /public/skills:
 *   get:
 *     summary: Get all public skills
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of public skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [backend, frontend, database, other]
 *                   imageUrl:
 *                     type: string
 *                   docsLink:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/skills', publicController.getPublicSkills);

/**
 * @swagger
 * /public/resumes:
 *   get:
 *     summary: Get all public resumes
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of public resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   fileName:
 *                     type: string
 *                   language:
 *                     type: string
 *                     enum: [en, ar, fr, es, de, it, ja, zh, hi]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/resumes', publicController.getPublicResumes);

export default router; 