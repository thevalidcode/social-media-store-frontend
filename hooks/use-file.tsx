"use client";

import { useAppContext } from "@/context/appContext";
import { CollectionName } from "@/types";
import { UploadLog } from "@/types/models/upload-log";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface UploadImageProps {
  file: File; // the image
  collection: CollectionName;
}

export function useUploadImage() {
  const { api, storeId } = useAppContext();

  return useMutation({
    mutationKey: ["uploadImage", storeId],

    mutationFn: async ({ file, collection }: UploadImageProps) => {
      if (!storeId) throw new Error("Store ID is missing");

      // Build the multipart form
      const formData = new FormData();
      formData.append("image", file);
      formData.append("collection", collection);

      const res = await api.post(`/files/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data) {
        throw new Error("Invalid server response");
      }

      return res.data;
    },

    onError: (error) => {
      let message = "Failed to upload image";

      if (error instanceof AxiosError) {
        message = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
}

export const usePreviousImages = (collection: CollectionName) => {
  const { api, storeId } = useAppContext();

  return useQuery<UploadLog[]>({
    queryKey: ["previousImages", storeId, collection],
    queryFn: async () => {
      const res = await api.get<{ images: UploadLog[] }>(
        `/files/image/logs?collection=${collection}`
      );
      if (!res.data) throw new Error("Failed to fetch previous images");
      return res.data.images;
    },
  });
};
