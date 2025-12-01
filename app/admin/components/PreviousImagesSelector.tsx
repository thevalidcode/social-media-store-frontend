"use client";

import { usePreviousImages } from "@/hooks/use-file";
import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionName, UploadLog } from "@/types";

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

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Choose an image</DialogTitle>
      </DialogHeader>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      ) : !images || images.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-3">
          No previous images were found.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-3">
          {images.map((img) => {
            const isSelected = selectedId === img.id;

            return (
              <button
                type="button"
                key={img.id}
                onClick={() => {
                  setSelectedId(img.id);
                  onSelect(img);
                }}
                className={`w-20 h-20 rounded-lg overflow-hidden border transition
                  ${isSelected ? "border-primary shadow-sm" : "border-border"}
                  hover:border-primary cursor-pointer`}
              >
                <img
                  src={img.url}
                  alt={img.filename || "Image"}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </DialogContent>
  );
};
