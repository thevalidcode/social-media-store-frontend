"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Tags, Import } from "lucide-react";
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
import ImportServicesDialog from "./ImportServicesDialog";
import { useCreateCategory, useGetCategories } from "@/hooks/use-category";
import Loading from "@/app/loading";
import { useGetProviders } from "@/hooks/use-providers";
import { useCreateService } from "@/hooks/use-services";
import { useAppContext } from "@/context/appContext";

interface SelectType {
  value: string;
  label: string;
}

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [isCategoryMode, setIsCategoryMode] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectType[]>([]);
  const [providerOptions, setProviderOptions] = useState<SelectType[]>([]);
  const { userCurrency } = useAppContext();

  const [newService, setNewService] = useState({
    name: "",
    category: "",
    type: "PACKAGE",
    min: 1,
    max: 1,
    price: "",
    providerPrice: 1,
    providerUid: "",
    icon: "",
    description: "",
    refillDays: 0,
    providerId: 0,
    syncQuantity: true,
    syncCatAndName: true,
    dripFeed: true,
    network: "",
    refill: true,
    cancel: true,
    currency: userCurrency,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetCategories();

  const { data: providerData, isLoading: isProviderLoading } =
    useGetProviders();

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: createService } = useCreateService();

  useEffect(() => {
    if (categoryData) {
      const mappedCategories = categoryData.map((category) => ({
        value: category.name,
        label: category.name,
      }));
      setCategoryOptions(mappedCategories);
    }
  }, [categoryData]);

  useEffect(() => {
    if (providerData) {
      const mappedProviders = providerData.map((provider) => ({
        value: provider.uid,
        label: provider.name,
      }));
      setProviderOptions(mappedProviders);
    }
  }, [providerData]);

  const handleServiceChange = (key: keyof typeof newService, value: any) => {
    setNewService((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (key: keyof typeof newCategory, value: any) => {
    setNewCategory((prev) => ({ ...prev, [key]: value }));
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

  const handleSave = () => {
    if (isCategoryMode) {
      createCategory(newCategory);
    } else {
      createService(newService);
    }
    setOpen(false);
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
            <DialogContent className="max-w-lg max-h-[90vh]  overflow-y-auto">
              {isCategoriesLoading || isProviderLoading ? (
                <Loading />
              ) : (
                <>
                  <DialogHeader className="flex flex-row mt-5 justify-between items-center">
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
                          placeholder="Category name"
                          className="w-full"
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
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label>Icon</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "category")}
                            className="w-full"
                          />
                          <Tags className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Add Category</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm mt-2">
                      <div className="flex justify-between items-center">
                        <Label>Add Service Details</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setImportOpen(true)}
                          className="flex items-center gap-1"
                        >
                          <Import className="w-4 h-4" /> Import from Provider
                        </Button>
                      </div>

                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newService.name}
                          onChange={(e) =>
                            handleServiceChange("name", e.target.value)
                          }
                          placeholder="Service name"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label>Category</Label>
                        <Select
                          onValueChange={(v) =>
                            handleServiceChange("category", v)
                          }
                          value={newService.category}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Type</Label>
                        <Select
                          onValueChange={(v) => handleServiceChange("type", v)}
                          value={newService.type}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PACKAGE">Package</SelectItem>
                            <SelectItem value="DEFAULT">Default</SelectItem>
                            <SelectItem value="SUBSCRIPTION">
                              Subscription
                            </SelectItem>
                            <SelectItem value="CUSTOMCOMMENTS">
                              Custom Comments
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Provider</Label>
                        <Select
                          onValueChange={(v) =>
                            handleServiceChange("providerUid", v)
                          }
                          value={newService.providerUid}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerOptions.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
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
                            className="w-full"
                            disabled={newService.type === "PACKAGE"}
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
                            className="w-full"
                            disabled={newService.type === "PACKAGE"}
                          />
                        </div>
                      </div>

                      {newService.providerUid !== "" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Provider Service ID</Label>
                            <Input
                              type="number"
                              value={newService.providerId}
                              onChange={(e) =>
                                handleServiceChange(
                                  "providerId",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Provider Price</Label>
                            <Input
                              type="number"
                              value={newService.providerPrice}
                              disabled
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Network</Label>
                            <Input
                              value={newService.network}
                              onChange={(e) =>
                                handleServiceChange("network", e.target.value)
                              }
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Refill Days</Label>
                            <Input
                              type="number"
                              value={newService.refillDays}
                              onChange={(e) =>
                                handleServiceChange(
                                  "refillDays",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: "syncQuantity", label: "Sync Quantity" },
                          {
                            key: "syncCatAndName",
                            label: "Sync Category & Name",
                          },
                          { key: "dripFeed", label: "Drip Feed" },
                          { key: "refill", label: "Refill" },
                          { key: "cancel", label: "Cancel" },
                        ]
                          .filter((item) =>
                            newService.providerUid !== ""
                              ? item.key !== "syncCatAndName" &&
                                item.key !== "syncQuantity"
                              : true
                          )
                          .map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center justify-between border p-2 rounded-md"
                            >
                              <Label>{item.label}</Label>
                              <Switch
                                checked={(newService as any)[item.key]}
                                onCheckedChange={(v) =>
                                  handleServiceChange(item.key as any, v)
                                }
                              />
                            </div>
                          ))}
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newService.description}
                          onChange={(e) =>
                            handleServiceChange("description", e.target.value)
                          }
                          placeholder="Describe the service..."
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label>Icon</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "service")}
                            className="w-full"
                          />
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Add Service</Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Import Dialog */}
      <ImportServicesDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
