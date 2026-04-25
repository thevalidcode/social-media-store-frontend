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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryForm from "../../categories/components/CategoryForm";
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
import { FeatureGate } from "@/components/FeatureGate";
import {
  useApproveServiceRating,
  useDeleteServiceRatingForAdmins,
  useGetPendingRatings,
} from "@/hooks/use-serviceRating";
import type { ServiceRatingWithService } from "@/types/models/serviceRating";
import { Star } from "lucide-react";

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
  const { data: pendingRatingsData, isLoading: isPendingRatingsLoading } =
    useGetPendingRatings(1, 100);
  const { mutate: approveRating, isPending: isApprovingRating } =
    useApproveServiceRating();
  const { mutate: deleteRatingForAdmin, isPending: isDeletingRating } =
    useDeleteServiceRatingForAdmins();

  const { userCurrency, storeInfo } = useAppContext();
  const convert = useCurrencyConverter();
  const isSubscriptionActive = storeInfo?.subscriptionStatus === "ACTIVE";
  const filteredPendingRatings = (
    (pendingRatingsData?.ratings || []) as ServiceRatingWithService[]
  ).filter((rating) => rating.service?.uid === editingItem?.uid);

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
        newService.currency || userCurrency,
        "USD",
        Number(newService.price),
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
      <DialogContent className="sm:max-w-[1080px] max-h-[92vh] p-0 overflow-hidden">
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

            <div className="max-h-[calc(92vh-8.5rem)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5">
              {!editingItem && (
                <Tabs
                  value={isCategoryMode ? "category" : "service"}
                  onValueChange={(value) =>
                    setIsCategoryMode(value === "category")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="service">Service</TabsTrigger>
                    <TabsTrigger value="category">Category</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <div className="space-y-5">
                {isCategoryMode ? (
                  <CategoryForm
                    category={newCategory}
                    setCategory={setNewCategory}
                  />
                ) : (
                  <ServiceForm
                    service={newService}
                    setService={setNewService}
                    isEditing={editingItem ? true : false}
                    setOpen={setOpen}
                    categoryOptions={categoryOptions}
                    providerOptions={providerOptions}
                    isSubscriptionActive={isSubscriptionActive}
                  />
                )}
              </div>

              {!isCategoryMode && editingItem?.uid && (
                <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Pending service ratings
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Review customer ratings before they go public.
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground rounded-full bg-muted px-2.5 py-1">
                      {filteredPendingRatings.length} pending
                    </span>
                  </div>

                  {isPendingRatingsLoading ? (
                    <p className="text-xs text-muted-foreground">Loading ratings...</p>
                  ) : filteredPendingRatings.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No pending ratings for this service.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {filteredPendingRatings.map((rating: ServiceRatingWithService) => (
                        <div
                          key={rating.uid}
                          className="rounded-lg border border-border bg-muted/20 p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                  key={index}
                                  className={`h-3.5 w-3.5 ${
                                    index < rating.rating
                                      ? "fill-current"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {new Date(rating.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {rating.review && (
                            <p className="mt-2 text-xs text-muted-foreground break-words">
                              {rating.review}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => approveRating({ uid: rating.uid, status: "REJECTED" })}
                              disabled={isApprovingRating || isDeletingRating}
                            >
                              Reject
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => approveRating({ uid: rating.uid, status: "APPROVED" })}
                              disabled={isApprovingRating || isDeletingRating}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteRatingForAdmin(rating.uid)}
                              disabled={isApprovingRating || isDeletingRating}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <FeatureGate
                  isAllowed={isSubscriptionActive}
                  featureLabel={isCategoryMode ? "Category Management" : "Service Management"}
                  variant="tooltip"
                  description="You need an active subscription to manage services and categories. Please renew your subscription to continue."
                >
                  <Button type="submit">
                    {isCategoryMode
                      ? editingItem
                        ? "Update Category"
                        : "Add Category"
                      : editingItem
                      ? "Update Service"
                      : "Add Service"}
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
