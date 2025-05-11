import { IsString, Length } from 'class-validator';

export class UploadResumeDto {
  @IsString()
  @Length(1, 255)
  fileName!: string;
} 