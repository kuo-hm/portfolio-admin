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

const formSchema = skillSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const updateSkill = useUpdateSkill();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skill.name,
      type: skill.type,
      imageUrl: getImageUrl(skill.imageUrl),
      docsLink: skill.docsLink,
      isPublic: skill.isPublic,
    },
  });

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

  const onSubmit = async (values: FormData) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("docsLink", values.docsLink);
    formData.append("isPublic", String(values.isPublic));

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    updateSkill.mutate(
      { id: skill.id, ...formData },
      {
        onSuccess: () => {
          onOpenChange(false);
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
