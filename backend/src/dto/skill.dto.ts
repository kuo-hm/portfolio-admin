import { IsString, IsEnum, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { SkillType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateSkillDto {
  @IsString()
  name!: string;

  @IsEnum(SkillType)
  type!: SkillType;

  @IsOptional()
  @IsString()
  lightImageUrl?: string;

  @IsOptional()
  @IsString()
  darkImageUrl?: string;

  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    require_host: true,
    require_port: false,
    allow_fragments: true,
    allow_query_components: true,
    validate_length: true,
    require_tld: false
  })
  @IsOptional()
  docsLink?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isPublic: boolean = false;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(SkillType)
  @IsOptional()
  type?: SkillType;

  @IsString()
  @IsOptional()
  lightImageUrl?: string;

  @IsString()
  @IsOptional()
  darkImageUrl?: string;

  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    require_host: true,
    require_port: false,
    allow_fragments: true,
    allow_query_components: true,
    validate_length: true,
    require_tld: false
  })
  @IsOptional()
  docsLink?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isPublic?: boolean;
} 