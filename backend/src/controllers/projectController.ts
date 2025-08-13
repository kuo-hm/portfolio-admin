import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PaginationDto, PaginatedResponse } from "../dto/pagination.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const projectController = {
  async getAllProjects(req: Request, res: Response) {
    try {
      const paginationDto = plainToInstance(PaginationDto, req.query);
      const errors = await validate(paginationDto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            skills: {
              select: { id: true },
            },
          },
        }),
        prisma.project.count(),
      ]);

      const response: PaginatedResponse<(typeof projects)[0]> = {
        data: projects,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects" });
    }
  },

  async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          skills: {
            select: { id: true },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Error fetching project" });
    }
  },

  async createProject(req: Request, res: Response) {
    try {
      const projectData = plainToInstance(CreateProjectDto, req.body);
      const errors = await validate(projectData);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      let imageUrl: string | undefined;

      if (req.file) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `project-${uniqueSuffix}${path.extname(
          req.file.originalname
        )}`;
        const relativePath = path.join("uploads", "projects", filename);
        const absolutePath = path.join(__dirname, "../../", relativePath);

        await fs.promises.mkdir(path.dirname(absolutePath), {
          recursive: true,
        });

        await fs.promises.rename(req.file.path, absolutePath);

        imageUrl = `/${relativePath}`;
      }
      const { skills, ...projectValidatedData } = projectData;
      const validSkills =
        skills && skills.length > 0
          ? await prisma.skill.findMany({
              where: { id: { in: skills } },
              select: { id: true },
            })
          : [];

      const project = await prisma.project.create({
        data: {
          ...projectValidatedData,
          imageUrl,
          skills: {
            connect: validSkills.map(({ id }) => ({ id })),
          },
        },
        include: { skills: true },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Error creating project" });
    }
  },

  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectData = plainToInstance(UpdateProjectDto, req.body);
      const errors = await validate(projectData);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      let imageUrl: string | undefined;

      if (req.file) {
        const existingProject = await prisma.project.findUnique({
          where: { id },
          select: { imageUrl: true },
        });

        if (existingProject?.imageUrl) {
          const oldImagePath = path.join(
            __dirname,
            "../../",
            existingProject.imageUrl
          );
          try {
            await fs.promises.unlink(oldImagePath);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `project-${uniqueSuffix}${path.extname(
          req.file.originalname
        )}`;
        const relativePath = path.join("uploads", "projects", filename);
        const absolutePath = path.join(__dirname, "../../", relativePath);

        await fs.promises.mkdir(path.dirname(absolutePath), {
          recursive: true,
        });

        await fs.promises.rename(req.file.path, absolutePath);

        imageUrl = `/${relativePath}`;
      }
      const { skills, ...projectValidatedData } = projectData;
      const validSkills =
        skills && skills.length > 0
          ? await prisma.skill.findMany({
              where: { id: { in: skills } },
              select: { id: true },
            })
          : [];

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...validSkills,
          ...(imageUrl && { imageUrl }),
          ...(validSkills.length > 0 && {
            skills: {
              set: validSkills.map(({ id }) => ({ id })),
            },
          }),
        },
      });

      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(500).json({ message: "Error updating project" });
    }
  },

  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await prisma.project.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (project?.imageUrl) {
        const imagePath = path.join(__dirname, "../../", project.imageUrl);
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          console.error("Error deleting project image:", error);
        }
      }

      await prisma.project.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(500).json({ message: "Error deleting project" });
    }
  },
};
