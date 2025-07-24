"use client"

import { useAppContext } from "@/context/appContext"
import { useMutation } from "@tanstack/react-query"

interface OrdeProps {
  service_id?: string,
  url?: string,
  comments?: string,
  drip_feed?: boolean,
  interval?: number,
  runs?: number,
  user_id?: string
}

export const useCreateOrder = () => {
  const { api } = useAppContext()

  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async (data: OrdeProps) => {
      const res = await api.post("/order", data)
      if (!res.data) {
        throw new Error("failed to create an order")
      }
      return res.data
    }
  })
}

export const useDeleteOrder = () => {
  const { api } = useAppContext()
  return useMutation({
    mutationKey: ["deleteOrder"],
    mutationFn: async (order_uid: string) => {
      const res = await api.delete(`/order/${order_uid}`)
      if (!res.data) {
        throw new Error("failed to delete an order ")
      }
      return res.data
    }
  })
}









