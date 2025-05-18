import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const publicController = {
  async getPublicProjects(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await prisma.project.count({
        where: {
          isPublic: true
        }
      });

      const projects = await prisma.project.findMany({
        where: {
          isPublic: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          websiteLink: true,
          githubLink: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });

      res.json({
        data: projects,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get public projects error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getPublicSkills(req: Request, res: Response) {
    try {
      const skills = await prisma.skill.findMany({
        where: {
          isPublic: true
        },
        select: {
          id: true,
          name: true,
          type: true,
          lightImageUrl: true,
          darkImageUrl: true,
          docsLink: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(skills);
    } catch (error) {
      console.error('Get public skills error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getPublicResumes(req: Request, res: Response) {
    try {
      const resumes = await prisma.resume.findMany({
        where: {
          isPublic: true
        },
        select: {
          id: true,
          fileName: true,
          language: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(resumes);
    } catch (error) {
      console.error('Get public resumes error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 