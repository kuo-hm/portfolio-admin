import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { resumeController } from '../controllers/resumeController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
router.use(authenticateToken);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get all resumes
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of resumes
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
 *                   filePath:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: Request, res: Response) => {
  await resumeController.getAllResumes(req, res);
});

/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get a resume by ID
 *     tags: [Resumes]
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
 *         description: Resume details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  await resumeController.getResumeById(req, res);
});

/**
 * @swagger
 * /api/resumes:
 *   post:
 *     summary: Upload a new resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or file type
 */
router.post('/', upload.single('resume') as express.RequestHandler, async (req: Request, res: Response) => {
  await resumeController.uploadResume(req, res);
});

/**
 * @swagger
 * /api/resumes/{id}:
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
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
 *         description: Resume deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 */
router.delete('/:id', async (req: Request, res: Response) => {
  await resumeController.deleteResume(req, res);
});

export default router; 