import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { EmailDto } from "../dto/email.dto";

const prisma = new PrismaClient();

export const publicController = {
  getPublicProjects: (async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.project.count({ where: { isPublic: true } });
    const projects = await prisma.project.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        description: true,
        websiteLink: true,
        githubLink: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    res.json({
      data: projects,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  }) as RequestHandler,

  getPublicSkills: (async (req, res) => {
    const skills = await prisma.skill.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        type: true,
        lightImageUrl: true,
        darkImageUrl: true,
        docsLink: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(skills);
  }) as RequestHandler,

  getPublicResumes: (async (req, res) => {
    const resumes = await prisma.resume.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        fileName: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        filePath: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(resumes);
  }) as RequestHandler,

  getImage: (async (req, res) => {
    const { path: encodedImagePath } = req.query;

    if (!encodedImagePath || typeof encodedImagePath !== "string") {
      return res.status(400).json({ message: "Image path is required" });
    }

    const imagePath = decodeURIComponent(encodedImagePath);
    const uploadsDir = path.resolve(__dirname, "../..");
    const fullPath = path.join(
      uploadsDir,
      path.normalize(imagePath).replace(/^(\.\.[\/\\])+/, "")
    );

    console.log(`Serving image from: ${fullPath}`);

    if (!fullPath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ message: "Image not found" });
      }

      const ext = path.extname(fullPath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
      };
      res.setHeader(
        "Content-Type",
        mimeTypes[ext] || "application/octet-stream"
      );

      fs.createReadStream(fullPath)
        .pipe(res)
        .on("error", () =>
          res.status(500).json({ message: "Error reading image file" })
        );
    });
  }) as RequestHandler,
  getPDF: (async (req, res) => {
    const { path: encodedPDFPath } = req.query;

    if (!encodedPDFPath || typeof encodedPDFPath !== "string") {
      return res.status(400).json({ message: "PDF path is required" });
    }

    const pdfPath = decodeURIComponent(encodedPDFPath);
    const uploadsDir = path.resolve(__dirname, "../..");
    const fullPath = path.join(
      uploadsDir,
      path.normalize(pdfPath).replace(/^(\.\.[\/\\])+/, "")
    );

    console.log(`Serving PDF from: ${fullPath}`);

    if (!fullPath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ message: "PDF not found" });
      }

      const ext = path.extname(fullPath).toLowerCase();
      if (ext !== ".pdf") {
        return res.status(400).json({ message: "Invalid file type" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(fullPath)}"`
      );

      fs.createReadStream(fullPath)
        .pipe(res)
        .on("error", () =>
          res.status(500).json({ message: "Error reading PDF file" })
        );
    });
  }) as RequestHandler,

  saveEmail: (async (req, res) => {
    const emailData = plainToInstance(EmailDto, req.body);
    const errors = await validate(emailData);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const email = await prisma.email.create({
      data: emailData,
    });

    res.status(201).json(email);
  }) as RequestHandler,
};
