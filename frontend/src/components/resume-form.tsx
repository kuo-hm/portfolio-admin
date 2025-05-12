"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUploadResume } from "@/hooks/use-resumes";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/lib/validations/resume";
import { FileText, Upload } from "lucide-react";

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    ),
  language: z.nativeEnum(Language),
  isPublic: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ResumeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeForm({ open, onOpenChange }: ResumeFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadResume = useUploadResume();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: Language.en,
      isPublic: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("file", file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.file) {
      return;
    }

    uploadResume.mutate(values.file, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        setSelectedFile(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Resume File</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          {selectedFile.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Only PDF files are allowed. Maximum size: 5MB
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Language.en}>English</SelectItem>
                      <SelectItem value={Language.ar}>Arabic</SelectItem>
                      <SelectItem value={Language.fr}>French</SelectItem>
                      <SelectItem value={Language.es}>Spanish</SelectItem>
                      <SelectItem value={Language.de}>German</SelectItem>
                      <SelectItem value={Language.it}>Italian</SelectItem>
                      <SelectItem value={Language.ja}>Japanese</SelectItem>
                      <SelectItem value={Language.zh}>Chinese</SelectItem>
                      <SelectItem value={Language.hi}>Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Visibility</FormLabel>
                    <FormDescription>
                      Make this resume visible to the public
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploadResume.isPending}>
                {uploadResume.isPending ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
