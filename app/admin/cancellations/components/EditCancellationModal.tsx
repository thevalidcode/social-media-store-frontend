"use client";

import React, { useState } from "react";
import { Cancel, CancelStatus } from "@/types/models/cancel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateCancellationStatus } from "@/hooks/use-cancellations";

const statusOptions: CancelStatus[] = [
  "PENDING",
  "COMPLETED",
  "ERROR",
  "REJECTED",
];

interface EditCancellationModalProps {
  cancellation: Cancel;
  onClose: () => void;
}

export function EditCancellationModal({
  cancellation,
  onClose,
}: EditCancellationModalProps) {
  const updateMutation = useUpdateCancellationStatus();
  const [status, setStatus] = useState<CancelStatus>(cancellation.status as CancelStatus);
  const [providerError, setProviderError] = useState(cancellation.providerError || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    updateMutation.mutate(
      {
        cancelUid: cancellation.uid,
        status,
        providerError: providerError || undefined,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Display Info */}
      <div className="space-y-2 rounded-lg bg-muted/50 p-3">
        <div className="text-sm">
          <span className="font-semibold">Order UID:</span>
          <span className="ml-2 font-mono text-xs">
            {cancellation.orderUid.substring(0, 16)}...
          </span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">Provider:</span>
          <span className="ml-2 font-mono text-xs">
            {cancellation.providerUid}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">Created:</span>
          <span className="ml-2 text-xs">
            {new Date(cancellation.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Status Field */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as CancelStatus)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Provider Error Field */}
      <div className="space-y-2">
        <Label htmlFor="provider-error">Provider Error (Optional)</Label>
        <Textarea
          id="provider-error"
          placeholder="Enter provider error message if applicable"
          className="resize-none"
          rows={3}
          value={providerError}
          onChange={(e) => setProviderError(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </div>
  );
}
