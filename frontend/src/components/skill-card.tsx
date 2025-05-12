import { Button } from "@/components/ui/button";
import { Image as ImageIcon, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/lib/validations/skill";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video w-full">
        {skill.imageUrl ? (
          <Image
            src={getImageUrl(skill.imageUrl)}
            alt={skill.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">No image</p>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-base line-clamp-1">{skill.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(skill)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(skill)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-3">Type: {skill.type}</p>
        <div className="mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs w-full sm:w-auto"
            asChild
          >
            <a href={skill.docsLink} target="_blank" rel="noopener noreferrer">
              View Docs
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
