"use client";

import { useAppContext } from "@/context/appContext";
import { SupportTicket, SupportTicketPublic, TicketPriority } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CreateSupportProps {
  priority?: TicketPriority;
  description?: string;
  subject: string;
  message: string;
}

export interface CreateMessageProps {
  message: string;
}

export const useCreateSupportTicket = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSupportTicket"],
    mutationFn: async (data: CreateSupportProps) => {
      const res = await api.post("/supports/tickets", data);
      if (!res.data) throw new Error("Failed to create ticket");
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the user's support tickets query so it refetches
      queryClient.invalidateQueries({ queryKey: ["userSupportTickets"] });
    },
  });
};

export const useGetUserSupportTicket = () => {
  const { api, storeId, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userSupportTickets", storeId, userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<SupportTicketPublic[]>("/supports/tickets");
      if (!res.data) throw new Error("Failed to get tickets");
      return res.data;
    },
  });
};

export const useGetSupportTicket = () => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["supportTickets", storeId],
    queryFn: async () => {
      const res = await api.get<SupportTicket[]>("/supports/tickets/admin");
      if (!res.data) throw new Error("Failed to get tickets");
      return res.data;
    },
  });
};

export const useCreateUserSupportMessage = (ticketUid: string) => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUserSupportMessage"],
    mutationFn: async (data: CreateMessageProps) => {
      const res = await api.post(`/supports/${ticketUid}/messages`, data);
      if (!res.data) throw new Error("Failed to create message");
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the user's support tickets query so it refetches
      queryClient.invalidateQueries({ queryKey: ["userSupportTickets"] });
    },
  });
};

export const useCreateSupportMessage = (ticketUid: string) => {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["createSupportMessage"],
    mutationFn: async (data: CreateMessageProps) => {
      const res = await api.post(`/supports/${ticketUid}/messages/admin`, data);
      if (!res.data) throw new Error("Failed to create message");
      return res.data;
    },
  });
};
