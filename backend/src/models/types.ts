export interface Project {
    id?: number;
    name: string;
    description?: string;
    website_link?: string;
    github_link?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Skill {
    id?: number;
    name: string;
    type: 'backend' | 'frontend' | 'database' | 'other';
    image_url?: string;
    docs_link?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Resume {
    id?: number;
    file_name: string;
    file_path: string;
    created_at?: Date;
    updated_at?: Date;
} 