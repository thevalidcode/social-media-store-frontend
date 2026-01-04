"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { PreviousImagesSelector } from "../components/PreviousImagesSelector";
import { CollectionName } from "@/types";
import { useUploadImage } from "@/hooks/use-file";
import { toast } from "sonner";

interface ImagePickerProps {
  label?: string;
  collection: CollectionName;
  value?: string;
  className?: string;
  onChange: (data: {
    url: string;
    filename: string | null;
    file?: File;
  }) => void;
}

export default function ImagePicker({
  label = "Image",
  collection,
  value,
  className = "lg:flex-nowrap",
  onChange,
}: ImagePickerProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const { mutateAsync: uploadImage } = useUploadImage();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show uploading toast
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const response = await uploadImage({ file, collection });

      setSelectedFileName(file.name);

      onChange({
        url: response.url,
        filename: file.name,
        file,
      });

      toast.success(`${file.name} uploaded successfully!`, { id: toastId });
    } catch (err) {
      toast.error(`Failed to upload ${file.name}`, { id: toastId });
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:gap-2 gap-1">
      {label && <Label>{label}</Label>}

      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {/* File Upload */}
        <div className="flex w-full items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-accent transition text-sm">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="cursor-pointer w-40"
          />

          <span className="text-muted-foreground truncate max-w-[140px]">
            {selectedFileName
              ? selectedFileName
              : value
              ? "Image selected"
              : "No file selected"}
          </span>
        </div>

        {/* Previous Images Selector */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition cursor-pointer text-sm"
              title="Browse previously uploaded images"
            >
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Gallery</span>
            </button>
          </DialogTrigger>

          <PreviousImagesSelector
            collection={collection}
            onSelect={(img) => {
              setSelectedFileName(img.filename);
              onChange({
                url: img.url,
                filename: img.filename,
                file: undefined,
              });
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}
