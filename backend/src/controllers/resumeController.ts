import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { PaginationDto, PaginatedResponse } from '../dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

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

      const [resumes, total] = await Promise.all([
        prisma.resume.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.resume.count(),
      ]);

      const response: PaginatedResponse<typeof resumes[0]> = {
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
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: 'Error fetching resumes' });
    }
  },

  
  async getResumeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id }
      });

      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: 'Error fetching resume' });
    }
  },

  
  async uploadResume(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const resume = await prisma.resume.create({
        data: {
          fileName: req.file.originalname,
          filePath: req.file.path
        }
      });

      res.status(201).json(resume);
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ message: 'Error uploading resume' });
    }
  },

  
  async downloadResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id: id },
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      const filePath = resume.filePath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.download(filePath, resume.fileName);
    } catch (error) {
      res.status(500).json({ error: 'Failed to download resume' });
    }
  },

  
  async deleteResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await prisma.resume.findUnique({
        where: { id }
      });

      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      
      const filePath = path.join(__dirname, '../../', resume.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      
      await prisma.resume.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ message: 'Error deleting resume' });
    }
  },
}; 