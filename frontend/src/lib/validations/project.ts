import * as z from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  websiteLink: z.string().url("Must be a valid URL"),
  githubLink: z.string().url("Must be a valid URL"),
  imageUrl: z.string().optional(),
  isPublic: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>; 