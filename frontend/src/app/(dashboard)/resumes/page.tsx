"use client";

import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2 } from "lucide-react";
import {
  useResumes,
  useUploadResume,
  useDeleteResume,
} from "@/hooks/use-resumes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";

export default function ResumesPage() {
  const { data: resumes, isLoading, error } = useResumes();
  const { mutate: uploadResume, isPending: isUploading } = useUploadResume();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadResume(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <Button onClick={handleUploadClick} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Resume"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
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
          <p className="text-sm text-destructive">Failed to load resumes</p>
        </div>
      ) : resumes?.data.length === 0 ? (
        <div className="rounded-md border">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">No resumes found.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes?.data.map((resume) => (
            <Card key={resume.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Uploaded on{" "}
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteResume(resume.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
