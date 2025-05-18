import * as z from "zod";

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["frontend", "backend", "database", "devops", "other"]),
  darkImageUrl: z.string().url("Must be a valid URL"),
  lightImageUrl: z.string().url("Must be a valid URL"),
  docsLink: z.string().url("Must be a valid URL"),
  isPublic: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const skillsResponseSchema = z.object({
  data: z.array(skillSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type Skill = z.infer<typeof skillSchema>;
export type SkillsResponse = z.infer<typeof skillsResponseSchema>; 