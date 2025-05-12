import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dashboardController = {
  async getDashboardData(req: Request, res: Response) {
    try {
      // Get total counts
      const [totalProjects, totalSkills, totalResumes] = await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.resume.count()
      ]);

      // Get recent projects
      const recentProjects = await prisma.project.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          createdAt: true
        }
      });

      // Get recent skills
      const recentSkills = await prisma.skill.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          type: true,
          imageUrl: true,
          createdAt: true
        }
      });

      res.json({
        kpis: {
          totalProjects,
          totalSkills,
          totalResumes
        },
        recentProjects,
        recentSkills
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 