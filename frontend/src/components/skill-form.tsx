"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useCreateSkill } from "@/hooks/use-skills";
import { ImageUpload } from "./image-upload";
import { Switch } from "@/components/ui/switch";
import { skillSchema } from "@/lib/validations/skill";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = skillSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
type FormData = z.infer<typeof formSchema>;

interface SkillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillForm({ open, onOpenChange }: SkillFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const createSkill = useCreateSkill();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "frontend",
      imageUrl: "",
      docsLink: "",
      isPublic: false,
    },
  });

  const handleSubmit = async (values: FormData) => {
    // Create FormData
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("docsLink", values.docsLink);
    formData.append("isPublic", String(values.isPublic));

    // Add image if selected
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    createSkill.mutate(formData, {
      onSuccess: () => {
        form.reset();
        setSelectedImage(null);
        onOpenChange(false);
      },
    });
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("imageUrl", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogDescription>
            Add a new skill to your portfolio. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Icon</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={handleImageChange}
                      onRemove={() => {
                        setSelectedImage(null);
                        field.onChange("");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Skill name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docsLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentation Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://docs.example.com" {...field} />
                  </FormControl>
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
                      Make this skill visible to the public
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedImage(null);
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSkill.isPending}>
                {createSkill.isPending ? "Creating..." : "Create Skill"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
