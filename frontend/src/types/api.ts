export interface Project {
  id: string;
  name: string;
  description: string;
  websiteLink: string;
  githubLink: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface Skill {
  id: string;
  name: string;
  type: 'backend' | 'frontend' | 'database' | 'other';
  imageUrl: string;
  docsLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  url: string;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
} 