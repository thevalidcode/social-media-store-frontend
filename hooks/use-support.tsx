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

/* ---------------------------------------------------------
    CREATE SUPPORT TICKET
--------------------------------------------------------- */
export const useCreateSupportTicket = () => {
  const { api, storeId, userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSupportTicket", storeId, userInfo?.uid],
    mutationFn: async (data: CreateSupportProps) => {
      const res = await api.post("/supports/tickets", data);
      if (!res.data) throw new Error("Failed to create ticket");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userSupportTickets", storeId, userInfo?.uid],
      });
    },
  });
};

/* ---------------------------------------------------------
    GET USER SUPPORT TICKETS (LIST)
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
    GET ADMIN SUPPORT TICKETS (LIST)
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
    GET USER TICKET BY UID
--------------------------------------------------------- */
export const useGetUserSupportTicketByUid = (uid: string) => {
  const { api, storeId, userInfo } = useAppContext();

  return useQuery({
    queryKey: ["userSupportTicketsByUid", storeId, userInfo?.uid, uid],
    queryFn: async () => {
      const res = await api.get<SupportTicketPublic>(
        `/supports/tickets/${uid}`
      );
      if (!res.data) throw new Error("Failed to get ticket");
      return res.data;
    },
  });
};

/* ---------------------------------------------------------
    GET ADMIN TICKET BY UID
--------------------------------------------------------- */
export const useGetSupportTicketByUid = (uid: string) => {
  const { api, storeId } = useAppContext();

  return useQuery({
    queryKey: ["supportTicketsByUid", storeId, uid],
    queryFn: async () => {
      const res = await api.get<SupportTicket>(
        `/supports/tickets/admin/${uid}`
      );
      if (!res.data) throw new Error("Failed to get ticket");
      return res.data;
    },
  });
};

/* ---------------------------------------------------------
    USER SEND MESSAGE (OPTIMISTIC)
--------------------------------------------------------- */
export const useCreateUserSupportMessage = (ticketUid: string) => {
  const { api, storeId, userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUserSupportMessage", ticketUid],
    mutationFn: async (data: CreateMessageProps) => {
      const res = await api.post(`/supports/${ticketUid}/messages`, data);
      if (!res.data) throw new Error("Failed to create message");
      return res.data;
    },

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: [
          "userSupportTicketsByUid",
          storeId,
          userInfo?.uid,
          ticketUid,
        ],
      });

      const previous = queryClient.getQueryData([
        "userSupportTicketsByUid",
        storeId,
        userInfo?.uid,
        ticketUid,
      ]);

      queryClient.setQueryData(
        ["userSupportTicketsByUid", storeId, userInfo?.uid, ticketUid],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );

      return { previous };
    },

    onError: (_err, _newMsg, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          ["userSupportTicketsByUid", storeId, userInfo?.uid, ticketUid],
          ctx.previous
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "userSupportTicketsByUid",
          storeId,
          userInfo?.uid,
          ticketUid,
        ],
      });
    },
  });
};

/* ---------------------------------------------------------
    ADMIN SEND MESSAGE (OPTIMISTIC)
--------------------------------------------------------- */
export const useCreateSupportMessage = (ticketUid: string) => {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSupportMessage", ticketUid],
    mutationFn: async (data: CreateMessageProps) => {
      const res = await api.post(`/supports/${ticketUid}/messages/admin`, data);
      if (!res.data) throw new Error("Failed to create message");
      return res.data;
    },

    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["supportTicketsByUid", storeId, ticketUid],
      });

      const previous = queryClient.getQueryData([
        "supportTicketsByUid",
        storeId,
        ticketUid,
      ]);

      queryClient.setQueryData(
        ["supportTicketsByUid", storeId, ticketUid],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );

      return { previous };
    },

    onError: (_err, _msg, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          ["supportTicketsByUid", storeId, ticketUid],
          ctx.previous
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supportTicketsByUid", storeId, ticketUid],
      });
    },
  });
};
