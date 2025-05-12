"use client";

import { useState } from "react";
import { useResumes } from "@/hooks/use-resumes";
import { ResumeCard } from "@/components/resume-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResumeForm } from "@/components/resume-form";

export default function ResumesPage() {
  const [showAddResume, setShowAddResume] = useState(false);
  const { data: resumesResponse, isLoading, error } = useResumes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading resumes</div>;
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Button onClick={() => setShowAddResume(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resumesResponse?.data.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>

      <ResumeForm open={showAddResume} onOpenChange={setShowAddResume} />
    </div>
  );
}


