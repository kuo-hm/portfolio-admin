"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Wrench, FileText } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { getImageUrl } from "@/lib/utils/image";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.totalSkills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.totalResumes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {data?.recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent projects
              </p>
            ) : (
              <div className="space-y-4">
                {data?.recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4">
                    {project.imageUrl ? (
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg">
                        <Image
                          src={getImageUrl(project.imageUrl)}
                          alt={project.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 flex-none rounded-lg bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium leading-none truncate">
                        {project.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-[500px] flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Recent Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {data?.recentSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent skills</p>
            ) : (
              <div className="space-y-4">
                {data?.recentSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4">
                    {skill.darkImageUrl ? (
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg">
                        <Image
                          src={getImageUrl(skill.darkImageUrl)}
                          alt={skill.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : skill.lightImageUrl ? (
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg">
                        <Image
                          src={getImageUrl(skill.lightImageUrl)}
                          alt={skill.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 flex-none rounded-lg bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium leading-none truncate">
                        {skill.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(skill.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
