"use client"

import { useAppContext } from "@/context/appContext"
import { useMutation, useQuery } from "@tanstack/react-query"

interface BlogProps {
  uid?: string,
  content?: string,
  description?: string,
  conver_image?: string,
  title?: string,
}
export const useCreateblog = () => {
  const { api } = useAppContext()
  return useMutation({
    mutationKey: ["createBlog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.post(`/blog`, data)
      if (!res.data) {
        throw new Error("failed to createBlog")
      }
      return res.data;
    }
  })
}


export const useGetBlogs = () => {
  const { api } = useAppContext()
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blog")
      if (!res.data) {
        throw new Error("failed to get blog data")
      }
      return res.data || []
    }
  })
}


export const usePatchBlog = () => {
  const { api } = useAppContext()
  return useMutation({
    mutationKey: ["patch_blog"],
    mutationFn: async (data: BlogProps) => {
      const res = await api.patch("/blog", data)
      if (!res.data) {
        throw new Error("an error occurred when we tried updating the blog")
      }
      return res.data
    }
  })
}


export const useGetBlogById = (blog_id: string) => {
  const { api, storeId } = useAppContext()
  return useQuery({
    queryKey: ["blog_id", blog_id],
    queryFn: async () => {
      const res = await api.get(`/blog/${blog_id}?storeId=${storeId}`)
      if (!res.data) {
        throw new Error("an error occurred, failed to get blog data")
        return res.data
      }
    }
  })
}
