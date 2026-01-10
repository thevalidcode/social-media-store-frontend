"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { OrderPublic } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface OrderEditDialogProps {
  order: OrderPublic;
  open: boolean;
  onClose: () => void;
  onSave: (updatedOrder: Partial<OrderPublic>) => void;
}

export const OrderEditDialog = ({
  order,
  open,
  onClose,
  onSave,
}: OrderEditDialogProps) => {
  const [form, setForm] = useState({
    status: order.status,
    url: order.url,
    providerError: order.providerError,
    remains: order.remains,
    comments: order.comments || "",
    syncOrder: (order as any).syncOrder ?? false,
    start: order.start,
  });

  const disabled = form.syncOrder;

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Order #{order.storeScopedId}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the order details and status below.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          {order.service.type !== "MANUAL" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="syncOrder">Sync Order</Label>
              <Switch
                id="syncOrder"
                checked={form.syncOrder}
                onCheckedChange={(val) => handleChange("syncOrder", val)}
                disabled={order.status === "FAILED"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
                <SelectItem value="CANCELED">CANCELED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              type="text"
              value={form.url}
              onChange={(e) => handleChange("url", e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Remains</Label>
            <Input
              type="number"
              value={form.remains}
              onChange={(e) => handleChange("remains", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Start</Label>
            <Input
              type="number"
              value={form.start}
              onChange={(e) => handleChange("start", Number(e.target.value))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Input
              type="text"
              value={form.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              disabled={disabled}
            />
          </div>

          {order.providerError && order.status === "FAILED" && (
            <div className="space-y-2">
              <Label>Provider Error</Label>
              <Textarea value={form.providerError} disabled />
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
