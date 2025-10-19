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

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  names,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  count: number;
  names: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm delete {count > 1 ? `${count} users` : "user"}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            This action cannot be undone. {count > 1 ? "Users to be deleted:" : "User to be deleted:"}
            <span className="block font-medium mt-2">{names.join(", ")}</span>
          </p>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>
            Delete {count > 1 ? "Users" : "User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
