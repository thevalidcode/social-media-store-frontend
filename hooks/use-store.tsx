"use client";

import { GeneralSettingProps, useAppContext } from "@/context/appContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateStoreSettingsProps {
  logoUrl?: string;
  faviconUrl?: string;
  storeName?: string;
  defaultClientCurrency?: string;
  storeDescription?: string;
  showBanner?: boolean;
  instagramUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  storePhone?: string;
  storeStreet?: string;
  storeCity?: string;
  storeState?: string;
  storePostalCode?: string;
  storeCountry?: string;
}

export interface UpdateStoreDesignProps {
  name: string;
  hex: string;
  schema: {
    ":root": Record<string, string>;
    ".dark"?: Record<string, string>;
  };
}

// =====================
// Update store settings
// =====================
export function useUpdateStoreSettings() {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStoreSettings", storeId],
    mutationFn: async (data: UpdateStoreSettingsProps) => {
      if (!storeId)
        throw new Error("No storeId available for updating settings");
      const res = await api.patch(`/stores/general-data`, data);
      if (!res.data) throw new Error("Failed to update store settings");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeSettings", storeId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update store settings",
      );
      toast.error(errorMsg);
    },
  });
}

// =====================
// Get store design
// =====================
export function useGetStoreDesign() {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["storeDesign", storeId],
    queryFn: async () => {
      if (!storeId) throw new Error("No storeId available for getting styles");
      const res = await api.get(`/stores/${storeId}/styles`);
      if (!res.data) throw new Error("Failed to get store styles");
      return res.data;
    },
    enabled: !!api && !!storeId,
  });
}

// =====================
// Update store design
// =====================
export function useUpdateStoreDesign() {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStoreDesign", storeId],
    mutationFn: async (data: UpdateStoreDesignProps) => {
      if (!storeId) throw new Error("No storeId available for updating styles");
      const res = await api.patch(`/stores/styles`, data);
      if (!res.data) throw new Error("Failed to update store styles");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["storeDesign", storeId], data);
      queryClient.invalidateQueries({ queryKey: ["storeDesign", storeId] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update store styles",
      );
      toast.error(errorMsg);
    },
  });
}

// update onboarding completed status
export function useUpdateOnboardingCompleted() {
  const { api, setGeneralSetting, storeId } = useAppContext();
  return useMutation({
    mutationFn: async () => {
      const res = await api.put(`/stores/${storeId}/onboarding-completed`);
      if (!res.data) throw new Error("Failed to update onboarding status");
      return res.data.setting;
    },
    onSuccess: (updatedSetting: GeneralSettingProps) => {
      setGeneralSetting({
        ...updatedSetting,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update onboarding status",
      );
      toast.error(errorMsg);
    },
  });
}
