import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginationDto, PaginatedResponse } from '../dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const skillController = {
  
  async getAllSkills(req: Request, res: Response) {
    try {
      const paginationDto = plainToInstance(PaginationDto, req.query);
      const errors = await validate(paginationDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [skills, total] = await Promise.all([
        prisma.skill.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.skill.count(),
      ]);

      const response: PaginatedResponse<typeof skills[0]> = {
        data: skills,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ message: 'Error fetching skills' });
    }
  },

  
  async getSkillById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const skill = await prisma.skill.findUnique({
        where: { id }
      });

      if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
      }

      res.json(skill);
    } catch (error) {
      console.error('Error fetching skill:', error);
      res.status(500).json({ message: 'Error fetching skill' });
    }
  },

  
  async createSkill(req: Request, res: Response) {
    try {
      const skillData = plainToInstance(CreateSkillDto, req.body);
      const errors = await validate(skillData);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      let imageUrl: string | undefined;
      
      if (req.file) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `skill-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        const relativePath = path.join('uploads', 'skills', filename);
        const absolutePath = path.join(__dirname, '../../', relativePath);

        
        await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });
        
        
        await fs.promises.rename(req.file.path, absolutePath);
        
        imageUrl = `/${relativePath}`;
      }

      const skill = await prisma.skill.create({
        data: {
          ...skillData,
          imageUrl
        }
      });

      res.status(201).json(skill);
    } catch (error) {
      console.error('Error creating skill:', error);
      res.status(500).json({ message: 'Error creating skill' });
    }
  },

  
  async updateSkill(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const skillData = plainToInstance(UpdateSkillDto, req.body);
      const errors = await validate(skillData);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      let imageUrl: string | undefined;
      
      if (req.file) {
        
        const existingSkill = await prisma.skill.findUnique({
          where: { id },
          select: { imageUrl: true }
        });

        if (existingSkill?.imageUrl) {
          const oldImagePath = path.join(__dirname, '../../', existingSkill.imageUrl);
          try {
            await fs.promises.unlink(oldImagePath);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `skill-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        const relativePath = path.join('uploads', 'skills', filename);
        const absolutePath = path.join(__dirname, '../../', relativePath);

        
        await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });
        
        
        await fs.promises.rename(req.file.path, absolutePath);
        
        imageUrl = `/${relativePath}`;
      }

      const skill = await prisma.skill.update({
        where: { id },
        data: {
          ...skillData,
          ...(imageUrl && { imageUrl })
        }
      });

      res.json(skill);
    } catch (error) {
      console.error('Error updating skill:', error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ message: 'Skill not found' });
      }
      res.status(500).json({ message: 'Error updating skill' });
    }
  },

  
  async deleteSkill(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      
      const skill = await prisma.skill.findUnique({
        where: { id },
        select: { imageUrl: true }
      });

      if (skill?.imageUrl) {
        const imagePath = path.join(__dirname, '../../', skill.imageUrl);
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting skill image:', error);
        }
      }

      await prisma.skill.delete({
        where: { id }
      });
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting skill:', error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ message: 'Skill not found' });
      }
      res.status(500).json({ message: 'Error deleting skill' });
    }
  }
}; 