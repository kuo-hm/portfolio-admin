import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateSkillDto } from '../dto/skill.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export const skillController = {
  
  async getAllSkills(req: Request, res: Response) {
    try {
      const skills = await prisma.skill.findMany();
      res.json(skills);
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
      const skillData = req.body as CreateSkillDto;
      const skill = await prisma.skill.create({
        data: skillData
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
      const skillData = req.body;

      const skill = await prisma.skill.update({
        where: { id },
        data: skillData
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