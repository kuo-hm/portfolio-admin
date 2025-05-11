import { IsString, IsOptional, IsUrl, Length, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

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
  websiteLink?: string;

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
  githubLink?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

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
  websiteLink?: string;

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
  githubLink?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
} 