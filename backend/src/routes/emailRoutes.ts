import express, { RequestHandler } from "express";
import { emailController } from "../controllers/emailController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.use(authenticateToken);

router.get("", emailController.getEmails as RequestHandler);

export default router;
