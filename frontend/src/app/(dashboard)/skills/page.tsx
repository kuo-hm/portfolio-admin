"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSkills, useDeleteSkill } from "@/hooks/use-skills";
import { useState } from "react";
import { SkillForm } from "@/components/skill-form";
import { SkillList } from "@/components/skill-list";
import { Skill } from "@/lib/validations/skill";
import { SkillEditForm } from "@/components/skill-edit-form";
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

export default function SkillsPage() {
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showEditSkill, setShowEditSkill] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { data: skillsResponse, isLoading, error } = useSkills();
  const deleteSkill = useDeleteSkill();

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowEditSkill(true);
  };

  const handleDelete = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedSkill?.id) return;
    deleteSkill.mutate(selectedSkill.id, {
      onSuccess: () => {
        setShowDeleteAlert(false);
        setSelectedSkill(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button onClick={() => setShowAddSkill(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <SkillList
        skills={skillsResponse?.data || []}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SkillForm open={showAddSkill} onOpenChange={setShowAddSkill} />

      {selectedSkill && (
        <>
          <SkillEditForm
            skill={selectedSkill}
            open={showEditSkill}
            onOpenChange={setShowEditSkill}
          />

          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the skill &quot;
                  {selectedSkill.name}&quot;. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteSkill.isPending}
                >
                  {deleteSkill.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
