import * as z from "zod";

export enum Language {
  en = "en",
  ar = "ar",
  fr = "fr",
  es = "es",
  de = "de",
  it = "it",
  ja = "ja",
  zh = "zh",
  hi = "hi",
} 

export const resumeSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  language: z.nativeEnum(Language),
  isPublic: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const resumeResponseSchema = z.object({
  data: z.array(resumeSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type Resume = z.infer<typeof resumeSchema>;
export type ResumeResponse = z.infer<typeof resumeResponseSchema>; 