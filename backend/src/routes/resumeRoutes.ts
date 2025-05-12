import express, { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import { resumeController } from '../controllers/resumeController';
import { authenticateToken } from '../middleware/auth';
import fs from 'fs';

const router = express.Router();
router.use(authenticateToken);

const tempDir = path.join(__dirname, '../../uploads/temp');
fs.mkdirSync(tempDir, { recursive: true });

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
 *     summary: Get all resumes with pagination and filtering
 *     tags: [Resumes]
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
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, ar, fr, es, de, it, ja, zh, hi]
 *         description: Filter resumes by language
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *         description: Filter resumes by public status
 *     responses:
 *       200:
 *         description: A paginated list of resumes
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
 *                       fileName:
 *                         type: string
 *                       filePath:
 *                         type: string
 *                       language:
 *                         type: string
 *                         enum: [en, ar, fr, es, de, it, ja, zh, hi]
 *                       isPublic:
 *                         type: boolean
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
 *         description: Invalid pagination or filter parameters
 */
router.get('/', resumeController.getAllResumes as RequestHandler);

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
router.get('/:id', resumeController.getResumeById as RequestHandler);

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
 *               language:
 *                 type: string
 *                 enum: [en, zh, ja, ko]
 *                 default: en
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or file type
 */
router.post('/', upload.single('resume') as RequestHandler, resumeController.uploadResume as RequestHandler);

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
router.delete('/:id', resumeController.deleteResume as RequestHandler);

export default router; 