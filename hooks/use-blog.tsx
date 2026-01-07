"use client";

import { useAppContext } from "@/context/appContext";
import { Blog, BlogStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface BlogProps {
  uid?: string;
  slug?: string;
  status?: BlogStatus;
  content?: string;
  description?: string;
  coverImage?: string;
  excerpt?: string;
  title?: string;
}
export const useCreateblog = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["createBlog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.post(`/blogs`, data);
      if (!res.data) {
        throw new Error("failed to createBlog");
      }
      return res.data;
    },
  });
};

export const useGetBlogs = () => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["blogs", storeId],
    queryFn: async () => {
      const res = await api.get<Blog[]>(`/blogs?storeId=${storeId}`);
      if (!res.data) {
        throw new Error("failed to get blog data");
      }
      return res.data || [];
    },
    enabled: !!api && !!storeId,
  });
};

export const useGetBlogById = (blogId: number) => {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["blogId", storeId, blogId],
    queryFn: async () => {
      const res = await api.get<{ blog: Blog | null }>(
        `/blogs/${blogId}?storeId=${storeId}`
      );

      const blog = res.data?.blog;

      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    },
    enabled: !!api && !!blogId && !!storeId,
  });
};

export const useUpdateBlog = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBlog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.patch("/blogs", data);
      if (!res.data) {
        throw new Error("an error occurred when we tried updating the blog");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the user's support tickets query so it refetches
      queryClient.invalidateQueries({ queryKey: ["userSupportTickets"] });
    },
  });
};

interface DeleteBlogProps {
  uid: string;
}

export const useDeleteBlog = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: async (data: DeleteBlogProps) => {
      const res = await api.delete(`/blogs`, { data });
      if (!res.data) {
        throw new Error("failed to delete blog");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the user's support tickets query so it refetches
      queryClient.invalidateQueries({ queryKey: ["userSupportTickets"] });
    },
  });
};

interface DeleteMultipleBlogProps {
  uids: string[];
}

export const useDeleteMultipleBlogs = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMultipleBlog"],
    mutationFn: async (data: DeleteMultipleBlogProps) => {
      const res = await api.delete(`/blogs/multiple`, { data });
      if (!res.data) {
        throw new Error("failed to delete blogs");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the user's support tickets query so it refetches
      queryClient.invalidateQueries({ queryKey: ["userSupportTickets"] });
    },
  });
};
