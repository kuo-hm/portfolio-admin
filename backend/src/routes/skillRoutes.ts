import express, { RequestHandler } from 'express';
import { skillController } from '../controllers/skillController';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.use(authenticateToken);

const tempDir = path.join(__dirname, '../../uploads/temp');
const skillsDir = path.join(__dirname, '../../uploads/skills');
fs.mkdirSync(tempDir, { recursive: true });
fs.mkdirSync(skillsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills with pagination
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
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
 *         description: A paginated list of skills
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
 *                       type:
 *                         type: string
 *                         enum: [backend, frontend, database, other]
 *                       imageUrl:
 *                         type: string
 *                       docsLink:
 *                         type: string
 *                       isPublic:
 *                         type: boolean
 *                         default: false
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
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid pagination parameters
 */

router.get('/', skillController.getAllSkills as RequestHandler);

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
 *         description: The skill
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 */

router.get('/:id', skillController.getSkillById as RequestHandler);

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
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
 *               docsLink:
 *                 type: string
 *                 format: uri
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or file type
 */

router.post('/', upload.single('image'), skillController.createSkill as RequestHandler);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [backend, frontend, database, other]
 *               image:
 *                 type: string
 *                 format: binary
 *               docsLink:
 *                 type: string
 *                 format: uri
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 */

router.put('/:id', upload.single('image'), skillController.updateSkill as RequestHandler);

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

router.delete('/:id', skillController.deleteSkill as RequestHandler);

export default router; 