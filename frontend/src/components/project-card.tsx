import { Button } from "@/components/ui/button";
import { MoreVertical, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/validations/project";
import Image from "next/image";
import { getImageUrl } from "../lib/utils/image";
import { IfElse } from "./IfElse";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onPublishChange: (project: Project, isPublic: boolean) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onPublishChange,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video w-full">
        <IfElse condition={!!project.imageUrl}>
          <Image
            src={getImageUrl(project.imageUrl!)}
            alt={project.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">No image</p>
            </div>
          </div>
        </IfElse>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-background/50 hover:bg-background/70"
          onClick={() => onPublishChange(project, !project.isPublic)}
        >
          {project.isPublic ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle visibility</span>
        </Button>
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-base line-clamp-1">{project.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(project)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(project)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1 sm:flex-none"
            asChild
          >
            <a
              href={project.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Site
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1 sm:flex-none"
            asChild
          >
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
