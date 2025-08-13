import { Transform } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsUrl,
  Length,
  IsBoolean,
  IsNumber,
  IsArray,
} from "class-validator";

export class CreateProjectDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({
    protocols: ["http", "https"],
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
    require_tld: false,
  })
  @IsOptional()
  websiteLink?: string;

  @IsUrl({
    protocols: ["http", "https"],
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
    require_tld: false,
  })
  @IsOptional()
  githubLink?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  isPublic?: boolean = false;

  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",");
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills!: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({
    protocols: ["http", "https"],
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
    require_tld: false,
  })
  @IsOptional()
  websiteLink?: string;

  @IsUrl({
    protocols: ["http", "https"],
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
    require_tld: false,
  })
  @IsOptional()
  githubLink?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  isPublic?: boolean;

  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",");
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills!: string[];
}
