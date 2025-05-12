"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Globe,
  Lock,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import { Resume } from "@/lib/validations/resume";
import { getImageUrl } from "@/lib/utils/image";
import { useDeleteResume } from "@/hooks/use-resumes";
import { ResumeEditForm } from "@/components/resume-edit-form";
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

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteResume = useDeleteResume();

  const handleOpenPdf = () => {
    window.open(getImageUrl(resume.filePath), "_blank");
  };

  const handleDelete = () => {
    deleteResume.mutate(resume.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <Card className="h-[200px] flex flex-col overflow-hidden">
        <CardHeader className="flex-none p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 flex-none" />
            <span className="truncate block">{resume.fileName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-4 pt-0">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {resume.isPublic ? (
                <Globe className="h-4 w-4 flex-none" />
              ) : (
                <Lock className="h-4 w-4 flex-none" />
              )}
              <span className="truncate block">
                {resume.language.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button
                variant="outline"
                className="flex-1 min-w-0"
                onClick={handleOpenPdf}
              >
                <ExternalLink className="mr-2 h-4 w-4 flex-none" />
                <span className="truncate">Open PDF</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResumeEditForm
        resume={resume}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resume &quot;{resume.fileName}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
