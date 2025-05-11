import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectHeaderProps {
  limit: number;
  onLimitChange: (value: string) => void;
  onAddClick: () => void;
}

export function ProjectHeader({
  limit,
  onLimitChange,
  onAddClick,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="flex items-center gap-4">
        <Select value={limit.toString()} onValueChange={onLimitChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    </div>
  );
}
