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
import { useUpdateSkill } from "@/hooks/use-skills";
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
import { getImageUrl } from "@/lib/utils/image";
import { Skill } from "@/lib/validations/skill";

const formSchema = skillSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    isPublic: z.boolean().optional(),
  });
type FormData = z.infer<typeof formSchema>;

interface SkillEditFormProps {
  skill: Skill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillEditForm({
  skill,
  open,
  onOpenChange,
}: SkillEditFormProps) {
  const [selectedImageDark, setSelectedImageDark] = useState<File | null>(null);
  const [selectedImageLight, setSelectedImageLight] = useState<File | null>(
    null
  );
  const updateSkill = useUpdateSkill();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skill.name,
      type: skill.type,
      darkImageUrl: getImageUrl(skill.darkImageUrl),
      lightImageUrl: getImageUrl(skill.lightImageUrl),
      docsLink: skill.docsLink,
      isPublic: skill.isPublic,
    },
  });

  const handleImageChange = (file: File | null, isDark: boolean) => {
    if (isDark) {
      setSelectedImageDark(file);
    } else {
      setSelectedImageLight(file);
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isDark) {
          form.setValue("darkImageUrl", reader.result as string);
        } else {
          form.setValue("lightImageUrl", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (isDark) {
        form.setValue("darkImageUrl", "");
      } else {
        form.setValue("lightImageUrl", "");
      }
    }
  };

  const onSubmit = async (values: FormData) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("docsLink", values.docsLink);
    formData.append("isPublic", String(values.isPublic));

    if (selectedImageDark) {
      formData.append("darkImage", selectedImageDark);
    }
    if (selectedImageLight) {
      formData.append("lightImage", selectedImageLight);
    }

    updateSkill.mutate(
      { id: skill.id, skill: formData },
      {
        onSuccess: () => {
          setSelectedImageDark(null);
          setSelectedImageLight(null);
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Update error:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-row gap-2 w-full">
              <FormField
                control={form.control}
                name="darkImageUrl"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Skill Icon (dark mode)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(file) => handleImageChange(file, true)}
                        onRemove={() => {
                          setSelectedImageDark(null);
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
                name="lightImageUrl"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Skill Icon (light mode)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(file) => handleImageChange(file, false)}
                        onRemove={() => {
                          setSelectedImageLight(null);
                          field.onChange("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateSkill.isPending}>
                {updateSkill.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
