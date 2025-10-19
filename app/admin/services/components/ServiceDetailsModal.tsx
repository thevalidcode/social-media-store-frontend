"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Service } from "@/types";

interface ServiceDetailsModalProps {
  service: Service;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onEdit: (service: Service) => void;
}

export default function ServiceDetailsModal({
  service,
  isOpen,
  onClose,
  onEdit,
  isEditing,
}: ServiceDetailsModalProps) {
  const [formData, setFormData] = useState(service);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (service: Service) => {
    // TODO: connect to API update
    console.log("Updated Service:", formData);
    onEdit(service);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                {formData.name}
                <Badge
                  variant={
                    formData.status === "active" ? "default" : "secondary"
                  }
                >
                  {formData.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 text-sm"
            >
              {isEditing ? (
                <form className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select
                      onValueChange={(v) => handleChange("type", v)}
                      value={formData.type}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Default">Default</SelectItem>
                        <SelectItem value="Package">Package</SelectItem>
                        <SelectItem value="Subscription">
                          Subscription
                        </SelectItem>
                        <SelectItem value="Custom Comments">
                          Custom Comments
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Min</Label>
                      <Input
                        type="number"
                        value={formData.min}
                        onChange={(e) =>
                          handleChange("min", Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label>Max</Label>
                      <Input
                        type="number"
                        value={formData.max}
                        onChange={(e) =>
                          handleChange("max", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleChange("price", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description ?? ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Enter service description..."
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <p>
                    <strong>Type:</strong> {formData.type}
                  </p>
                  <p>
                    <strong>Price:</strong> ${formData.price}
                  </p>
                  <p>
                    <strong>Range:</strong> {formData.min} - {formData.max}
                  </p>
                  {formData.description && (
                    <p>
                      <strong>Description:</strong> {formData.description}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {isEditing ? (
                  <Button onClick={() => handleSave(service)}>Save</Button>
                ) : (
                  <Button onClick={() => onEdit(service)}>Edit</Button>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
