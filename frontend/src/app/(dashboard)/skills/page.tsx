"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSkills } from "@/hooks/use-skills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function SkillsPage() {
  const { data: skills, isLoading, error } = useSkills();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
      ) : error ? (
        <div className="rounded-md border border-destructive p-4">
          <p className="text-sm text-destructive">Failed to load skills</p>
        </div>
      ) : skills?.data.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">No skills found.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {skills?.data.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="h-6 w-6 object-contain"
                    width={24}
                    height={24}
                  />
                  {skill.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Type: {skill.type}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={skill.docsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Docs
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
