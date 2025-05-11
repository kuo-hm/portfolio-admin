import { IsString, IsOptional, IsUrl, IsEnum, Length } from 'class-validator';

export enum SkillType {
  backend = 'backend',
  frontend = 'frontend',
  database = 'database',
  other = 'other',
}

export class CreateSkillDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsEnum(SkillType)
  type!: SkillType;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  docsLink?: string;
} 