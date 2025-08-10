import { Request, Response } from "express";
import { PrismaClient, Language } from "@prisma/client";
import path from "path";
import fs from "fs";
import { PaginationDto, PaginatedResponse } from "../dto/pagination.dto";
import { UploadResumeDto } from "../dto/resume.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

const prisma = new PrismaClient();

export const resumeController = {
  async getAllResumes(req: Request, res: Response) {
    try {
      const paginationDto = plainToInstance(PaginationDto, req.query);
      const errors = await validate(paginationDto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      // Get filter parameters
      const language = req.query.language as Language | undefined;
      const isPublic = req.query.isPublic === "true";

      const where = {
        ...(language && { language }),
        ...(isPublic !== undefined && { isPublic }),
      };

      const [resumes, total] = await Promise.all([
        prisma.resume.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.resume.count({ where }),
      ]);

      const response: PaginatedResponse<(typeof resumes)[0]> = {
        data: resumes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Error fetching resumes" });
    }
  },

  async getResumeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Error fetching resume" });
    }
  },

  async uploadResume(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { name: true },
      });

      if (!user?.name) {
        return res.status(400).json({ message: "User name not found" });
      }

      const resumeData = plainToInstance(UploadResumeDto, {
        fileName: req.file.originalname,
        language: req.body.language || "en",
        isPublic: req.body.isPublic === "true",
      });

      const errors = await validate(resumeData);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const fileName = `${user.name.toLowerCase().replace(/\s+/g, "_")}_${
        resumeData.language
      }_${new Date().toISOString().split("T")[0]}.pdf`;
      const savedFileName = `${user.name} ${resumeData.language}`;
      const relativePath = path.join("uploads", "resumes", fileName);
      const absolutePath = path.join(__dirname, "../../", relativePath);

      // Create directory if it doesn't exist
      await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });

      // Move file from temp to final location
      await fs.promises.rename(req.file.path, absolutePath);

      const resume = await prisma.resume.create({
        data: {
          fileName: savedFileName,
          filePath: `/${relativePath}`,
          language: resumeData.language,
          isPublic: resumeData.isPublic,
        },
      });

      res.status(201).json(resume);
    } catch (error) {
      console.error("Error uploading resume:", error);
      res.status(500).json({ message: "Error uploading resume" });
    }
  },

  async downloadResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id: id },
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const filePath = resume.filePath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      res.download(filePath, resume.fileName);
    } catch (error) {
      res.status(500).json({ error: "Failed to download resume" });
    }
  },

  async deleteResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const filePath = path.join(__dirname, "../../", resume.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await prisma.resume.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Error deleting resume" });
    }
  },
};
