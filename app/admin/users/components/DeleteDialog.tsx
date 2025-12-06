"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  count: number;
  names?: string[];
  entityName?: string;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  names = [],
  entityName = "item",
}: DeleteDialogProps) {
  const pluralEntity = count > 1 ? `${entityName}s` : entityName;
  const title = `Confirm delete ${
    count > 1 ? count + " " + pluralEntity : pluralEntity
  }`;
  const description = `This action cannot be undone. ${
    count > 1
      ? `The following ${pluralEntity} will be permanently deleted:`
      : `The following ${entityName} will be permanently deleted:`
  }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg w-[90vw] sm:w-full p-6 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground mb-1">
            {title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {names.length > 0 && (
            <div className="mt-3 max-h-32 overflow-y-auto rounded-md bg-muted/40 p-3 text-sm text-foreground border border-muted-foreground/10">
              <ul className="list-disc list-inside space-y-1 break-words">
                {names.map((name, idx) => (
                  <li key={idx} className="whitespace-normal break-all">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            className="min-w-[90px]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="min-w-[120px]"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete {count > 1 ? pluralEntity : entityName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
