"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CategoryForm from "./CategoryForm";
import ServiceForm from "./ServiceForm";
import { useState, useEffect, FormEvent } from "react";
import Loading from "@/app/loading";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-category";
import { useCreateService, useUpdateService } from "@/hooks/use-services";
import { useGetProviders } from "@/hooks/use-providers";
import { CurrencyCode, useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/appContext";

type SelectOption = {
  value: string | number;
  label: string;
  image?: string;
};

export default function ServiceDialog({
  open,
  setOpen,
  editingItem, // optional
  isCategoryModeDefault = false,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  editingItem?: any;
  isCategoryModeDefault?: boolean;
}) {
  const [isCategoryMode, setIsCategoryMode] = useState(isCategoryModeDefault);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [providerOptions, setProviderOptions] = useState<SelectOption[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    uid: "",
  });
  const [newService, setNewService] = useState({
    type: "PACKAGE",
    min: 1,
    max: 1,
    providerUid: "",
    providerId: 0,
    providerPrice: "0.0",
    network: "",
    refillDays: 0,
    syncQuantity: true,
    syncCatAndName: true,
    dripFeed: true,
    refill: true,
    cancel: true,
    name: "",
    category: "",
    description: "",
    currency: "USD" as CurrencyCode,
    price: "0.0",
    icon: "",
    uid: "",
  });

  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { data: providerData, isLoading: isProviderLoading } =
    useGetProviders();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: createService } = useCreateService();
  const { mutate: updateService } = useUpdateService();
  const { mutate: updateCategory } = useUpdateCategory();

  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  useEffect(() => {
    if (categoryData)
      setCategoryOptions(
        categoryData.map((c) => ({
          value: c.name,
          label: c.name,
          image: c.icon,
        }))
      );
  }, [categoryData]);

  useEffect(() => {
    if (providerData)
      setProviderOptions(
        providerData.map((p) => ({
          value: p.uid,
          label: p.name,
          image: p.image,
        }))
      );
  }, [providerData]);

  // Populate form if editing
  useEffect(() => {
    if (editingItem) {
      if (isCategoryMode) setNewCategory(editingItem);
      else setNewService(editingItem);
    }
  }, [editingItem, isCategoryMode]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const parsedService = {
      ...newService,
      price: convert(
        userCurrency,
        "USD",
        newService.price,
        true,
        false
      ).amount.toString(),
    };
    if (editingItem) {
      if (isCategoryMode) updateCategory(newCategory);
      else updateService(parsedService);
    } else {
      if (isCategoryMode) createCategory(newCategory);
      else createService(parsedService);
    }
    setOpen(false);
    setNewCategory({ name: "", description: "", icon: "", uid: "" });
    setNewService({
      type: "PACKAGE",
      min: 1,
      max: 1,
      providerUid: "",
      providerId: 0,
      providerPrice: "0.0",
      network: "",
      refillDays: 0,
      syncQuantity: true,
      syncCatAndName: true,
      dripFeed: true,
      refill: true,
      cancel: true,
      name: "",
      category: "",
      description: "",
      currency: "USD" as CurrencyCode,
      price: "0.0",
      icon: "",
      uid: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        {isCategoriesLoading || isProviderLoading ? (
          <div className="px-6 py-4">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>
                {isCategoryMode
                  ? editingItem
                    ? "Edit Category"
                    : "Add New Category"
                  : editingItem
                  ? "Edit Service"
                  : "Add New Service"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isCategoryMode
                  ? editingItem
                    ? "Update the category details below."
                    : "Create a new category to organize your services."
                  : editingItem
                  ? "Update the service details below."
                  : "Create a new service to add to your catalog."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-5">
              {!editingItem && (
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
              )}

              {isCategoryMode ? (
                <CategoryForm
                  category={newCategory}
                  setCategory={setNewCategory}
                  isEditing={editingItem ? true : false}
                />
              ) : (
                <ServiceForm
                  service={newService}
                  setService={setNewService}
                  isEditing={editingItem ? true : false}
                  categoryOptions={categoryOptions}
                  providerOptions={providerOptions}
                />
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isCategoryMode
                    ? editingItem
                      ? "Update Category"
                      : "Add Category"
                    : editingItem
                    ? "Update Service"
                    : "Add Service"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
