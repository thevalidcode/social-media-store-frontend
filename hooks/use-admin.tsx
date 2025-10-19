"use client";
import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Custom hook for admin-related queries and mutations
// Naming follows the convention: useAdmins for fetching, useCreateAdmin/useUpdateAdmin for mutations

interface LoginProps {
  email: string;
  password: string;
  storeId: number;
}
export function useAdminLogin() {
  const { api, setAdminInfo } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationKey: ["adminLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/admins/me`, {
        email: data.email,
        password: data.password,
        storeId: data.storeId,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login admin: No response data received from server."
        );
      }
      // console.log("Login response:", res.data);
      return res.data;
    },
    onSuccess: async (data) => {
      const res = await api.get(`/stores/current-admin`);
      // Set admin info in context, which also persists it to IndexedDB.
      setAdminInfo({
        ...res.data,
      });
      // Redirect to the appropriate dashboard. The admin session is now active.
      router.push("/admin/users");
    },
    onError: (error: unknown) => {
      // Enhanced error extraction for better admin feedback
      let errorMsg = "An unexpected error occurred during login.";
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data?.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg =
            "Failed to login admin: Server returned an unknown error format.";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

// get admins
export function useGetAdmins() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      // The 'withCredentials' option is now set globally in the API context.
      const res = await api.get(`/admins`, {});
      if (!res.data) throw new Error("Failed to fetch admin");
      return res.data;
    },
  });
}

// ! get admin by id`
export function useGetAdminById(id: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["admin", id],
    queryFn: async () => {
      const res = await api.get(`/admins/${id}`);
      if (!res.data) throw new Error("Failed to fetch admin");
      return res.data;
    },
  });
}

interface DeleteAdminsProps {
  uids: string[];
}

//! delete multiple admins
export function useDeleteMultipleAdmins() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteAdminsProps) => {
      const res = await api.delete(`/admins/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete admins");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admins deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete admins");
      } else {
        toast.error("Failed to delete admins");
      }
    },
  });
}

//! delete a single admin

interface DeleteAdminProps {
  uid: string;
}
export const useDeleteASingleAdmin = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteAdminProps) => {
      const res = await api.delete(`/admins`, {
        data: { uid: data.uid },
      });
      if (!res.data) throw new Error("Failed to delete admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete admin");
      } else {
        toast.error("Failed to delete admin");
      }
    },
  });
};

// update admin info
interface UpdateAdminProps {
  uid: string;
  username: string;
  email: string;
  fullName: string;
}

export function useUpdateAdmin() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: UpdateAdminProps) => {
      const res = await api.patch(`/admins`, data);
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update admin");
      } else {
        toast.error("Failed to update admin");
      }
    },
  });
}
