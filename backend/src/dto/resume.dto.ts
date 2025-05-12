import { Language } from '@prisma/client';
import { IsString, Length, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class UploadResumeDto {

  @IsString()
  @IsEnum(Language)
  language!: Language;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean = false;
} 