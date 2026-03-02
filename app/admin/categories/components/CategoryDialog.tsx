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
import { Label } from "@/components/ui/label";
import { useState, useEffect, FormEvent } from "react";
import Loading from "@/app/loading";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import CategoryForm from "../components/CategoryForm";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";

export default function CategoryDialog({
  open,
  setOpen,
  editingItem,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  editingItem?: any;
}) {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    uid: "",
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { storeInfo } = useAppContext();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";

  const isLoading = isCreating || isUpdating;

  // Populate form if editing
  useEffect(() => {
    if (editingItem) {
      setNewCategory(editingItem);
    } else {
      setNewCategory({ name: "", description: "", icon: "", uid: "" });
    }
  }, [editingItem, open]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updateCategory(newCategory);
    } else {
      createCategory(newCategory);
    }
    setOpen(false);
    setNewCategory({ name: "", description: "", icon: "", uid: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        {isLoading ? (
          <div className="px-6 py-4">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>
                {editingItem ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingItem
                  ? "Update the category details below."
                  : "Create a new category to organize your services."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-5">
              <CategoryForm
                category={newCategory}
                setCategory={setNewCategory}
                isEditing={editingItem ? true : false}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <FeatureGate
                  isAllowed={isSubscriptionActive}
                  featureLabel={editingItem ? "Update Category" : "Add Category"}
                  description="Your subscription is required to save category changes."
                  variant="tooltip"
                >
                  <Button type="submit">
                    {editingItem ? "Update Category" : "Add Category"}
                  </Button>
                </FeatureGate>
              </DialogFooter>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
