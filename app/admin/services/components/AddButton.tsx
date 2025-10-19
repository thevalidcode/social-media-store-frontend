"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Tags } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [isCategoryMode, setIsCategoryMode] = useState(false);

  const [newService, setNewService] = useState({
    name: "",
    category: "",
    type: "Default",
    price: 0,
    min: 1,
    max: 1,
    description: "",
    icon: null as File | null,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: null as File | null,
  });

  const handleServiceChange = (key: keyof typeof newService, value: any) => {
    setNewService((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (key: keyof typeof newCategory, value: any) => {
    setNewCategory((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    if (isCategoryMode) {
      console.log("New Category:", newCategory);
    } else {
      console.log("New Service:", newService);
    }
    setOpen(false);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "service" | "category"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "service") handleServiceChange("icon", file);
    else handleCategoryChange("icon", file);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-primary text-primary-foreground p-4 hover:scale-105 transition"
        whileTap={{ scale: 0.95 }}
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader className="flex flex-row justify-between items-center">
                <DialogTitle>
                  {isCategoryMode ? "Add New Category" : "Add New Service"}
                </DialogTitle>

                <div className="flex items-center gap-2">
                  <Label htmlFor="switch-mode" className="text-xs">
                    Category
                  </Label>
                  <Switch
                    id="switch-mode"
                    checked={isCategoryMode}
                    onCheckedChange={setIsCategoryMode}
                  />
                </div>
              </DialogHeader>

              {isCategoryMode ? (
                <div className="space-y-3 text-sm mt-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) =>
                        handleCategoryChange("name", e.target.value)
                      }
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newCategory.description}
                      onChange={(e) =>
                        handleCategoryChange("description", e.target.value)
                      }
                      placeholder="Short category description..."
                    />
                  </div>

                  <div>
                    <Label>Icon</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "category")}
                      />
                      <Tags className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add Category</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm mt-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newService.name}
                      onChange={(e) =>
                        handleServiceChange("name", e.target.value)
                      }
                      placeholder="Service name"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Input
                      value={newService.category}
                      onChange={(e) =>
                        handleServiceChange("category", e.target.value)
                      }
                      placeholder="Category name or ID"
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <Select
                      onValueChange={(v) => handleServiceChange("type", v)}
                      value={newService.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
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
                        value={newService.min}
                        onChange={(e) =>
                          handleServiceChange("min", Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label>Max</Label>
                      <Input
                        type="number"
                        value={newService.max}
                        onChange={(e) =>
                          handleServiceChange("max", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={newService.price}
                      onChange={(e) =>
                        handleServiceChange("price", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newService.description}
                      onChange={(e) =>
                        handleServiceChange("description", e.target.value)
                      }
                      placeholder="Describe the service..."
                    />
                  </div>

                  <div>
                    <Label>Icon</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "service")}
                      />
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add Service</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
