"use client";

import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery } from "@tanstack/react-query";
interface OrderProps {}
export const useCreateNewOrder = () => {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationKey: ["createNewOrder"],
    mutationFn: async (orderData: {}) => {},
  });
};
