import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  preview?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function ImageUpload({
  value,
  onChange,
  onRemove,
  preview,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onChange(file);

      return () => URL.revokeObjectURL(objectUrl);
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onRemove();
  };

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const displayUrl = preview
    ? preview.startsWith("http")
      ? preview
      : `${BACKEND_URL}${preview}`
    : previewUrl;

  if (displayUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
        <Image
          src={displayUrl}
          alt="Upload preview"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors",
        isDragging && "border-primary"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("imageUpload")?.click()}
    >
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Upload className="h-8 w-8" />
        <p className="text-sm font-medium">Drag & drop or click to upload</p>
        <p className="text-xs">Max file size: 5MB</p>
      </div>
    </div>
  );
}
