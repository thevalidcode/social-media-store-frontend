"use client";

import { useAppContext } from "@/context/appContext";
import { Category, CategoryStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateCategoryProps {
  uid: string;
  name?: string;
  icon?: string;
  description?: string;
  status?: CategoryStatus;
}

interface CreateCategoryProps {
  name?: string;
  icon?: string;
  description?: string;
}

// get categories
export const useGetCategories = () => {
  const { storeId, api } = useAppContext();
  return useQuery({
    queryKey: ["categories", storeId],
    queryFn: async () => {
      const res = await api.get<Category[]>(`/categories?storeId=${storeId}`);
      return res.data;
    },
    enabled: !!storeId,
  });
};

//  creating a new category
export const useCreateCategory = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CreateCategoryProps) => {
      const res = await api.post(`/categories`, category);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", storeId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create category"
      );
      toast.error(errorMsg);
    },
  });
};

// updating a category
export const useUpdateCategory = () => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: UpdateCategoryProps) => {
      const res = await api.patch(`/categories`, category);
      if (!res.data) {
        throw new Error(res.data.message || "Failed to update category");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", storeId] });
    },
    onError: (error: any) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update category"
      );
      toast.error(errorMsg);
    },
  });
};

// delete a single category
interface CategoryDeleteProps {
  uid: string;
}
export const useDeleteCategory = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (uid: CategoryDeleteProps) => {
      const res = await api.delete(`/categories`, {
        params: { uid: uid.uid },
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete category");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// delete multiple categories
interface DeleteMultipleCategorysProps {
  uids: string[];
}
export const useDeleteMultipleCategorys = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteMultipleCategorys"],
    mutationFn: async (uids: DeleteMultipleCategorysProps) => {
      const res = await api.delete(`/categories/multiple`, {
        params: { uiods: uids.uids },
        withCredentials: true,
      });
      if (!res.data) {
        throw new Error(res.data.message || "Failed to delete categories");
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Categorys deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
