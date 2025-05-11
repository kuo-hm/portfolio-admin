import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project } from "@/lib/validations/project";
import { ProjectCard } from "./project-card";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  error: unknown;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onPublishChange: (project: Project, isPublic: boolean) => void;
}

export function ProjectList({
  projects,
  isLoading,
  error,
  onEdit,
  onDelete,
  onPublishChange,
}: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-1/3 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-2/3 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive p-4">
        <p className="text-sm text-destructive">
          Failed to load projects:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">No projects found.</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            No projects yet. Add your first project!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublishChange={onPublishChange}
        />
      ))}
    </div>
  );
}
