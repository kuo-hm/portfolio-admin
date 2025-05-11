import express, { Request, Response } from 'express';
import { skillController } from '../controllers/skillController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();


router.use(authenticateToken);

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of skills
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
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: Request, res: Response) => {
  await skillController.getAllSkills(req, res);
});

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get a skill by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [backend, frontend, database, other]
 *                 imageUrl:
 *                   type: string
 *                 docsLink:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  await skillController.getSkillById(req, res);
});

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [backend, frontend, database, other]
 *               imageUrl:
 *                 type: string
 *               docsLink:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req: Request, res: Response) => {
  await skillController.createSkill(req, res);
});

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [backend, frontend, database, other]
 *               imageUrl:
 *                 type: string
 *               docsLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 */
router.put('/:id', async (req: Request, res: Response) => {
  await skillController.updateSkill(req, res);
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Skill deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 */
router.delete('/:id', async (req: Request, res: Response) => {
  await skillController.deleteSkill(req, res);
});

export default router; 