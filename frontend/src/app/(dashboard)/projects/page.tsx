"use client";

import { useState } from "react";
import {
  useProjects,
  useDeleteProject,
  useUpdateProject,
} from "@/hooks/use-projects";
import { ProjectForm } from "@/components/project-form";
import { ProjectEditForm } from "@/components/project-edit-form";
import { ProjectHeader } from "@/components/project-header";
import { ProjectList } from "@/components/project-list";
import { ProjectPagination } from "@/components/project-pagination";
import { Project } from "@/lib/validations/project";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data, isLoading, error } = useProjects(page, limit);
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const totalPages = data?.meta.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowEditProject(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteAlert(true);
  };

  const handlePublishChange = (project: Project, isPublic: boolean) => {
    if (!project.id) return;

    updateProject.mutate({
      id: project.id,
      isPublic,
    });
  };

  const confirmDelete = async () => {
    if (!selectedProject?.id) return;

    deleteProject.mutate(selectedProject.id, {
      onSuccess: () => {
        setShowDeleteAlert(false);
        setSelectedProject(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        limit={limit}
        onLimitChange={handleLimitChange}
        onAddClick={() => setShowAddProject(true)}
      />

      <ProjectList
        projects={data?.data || []}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublishChange={handlePublishChange}
      />

      <ProjectPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ProjectForm open={showAddProject} onOpenChange={setShowAddProject} />

      {selectedProject && (
        <>
          <ProjectEditForm
            project={selectedProject}
            open={showEditProject}
            onOpenChange={setShowEditProject}
          />

          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project &quot;
                  {selectedProject.name}&quot;. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
