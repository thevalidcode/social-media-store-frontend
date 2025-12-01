"use client";

import { usePreviousImages } from "@/hooks/use-file";
import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionName } from "@/types";
import { UploadLog } from "@/types";

interface PreviousImagesSelectorProps {
  onSelect: (image: UploadLog) => void;
  collection: CollectionName;
}

export const PreviousImagesSelector = ({
  collection,
  onSelect,
}: PreviousImagesSelectorProps) => {
  const { data: images, isLoading } = usePreviousImages(collection);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="w-16 h-16 rounded" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No previous images found.
      </div>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select a previous image</DialogTitle>
      </DialogHeader>
      <div className="flex flex-wrap gap-2 mt-2">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => {
              setSelectedId(img.id);
              onSelect(img);
            }}
            className={`w-16 h-16 rounded overflow-hidden cursor-pointer border-2 ${
              selectedId === img.id ? "border-primary" : "border-transparent"
            } hover:border-primary transition`}
          >
            <img
              src={img.url}
              alt={img.filename || "Previous Image"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </DialogContent>
  );
};
