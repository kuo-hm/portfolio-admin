import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skill } from "@/lib/validations/skill";
import { SkillCard } from "./skill-card";

interface SkillListProps {
  skills: Skill[];
  isLoading: boolean;
  error: unknown;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export function SkillList({
  skills,
  isLoading,
  error,
  onEdit,
  onDelete,
}: SkillListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <p className="text-sm text-destructive">Failed to load skills</p>
      </div>
    );
  }

  if (!skills.length) {
    return (
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">No skills found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
