"use client";
import { useAppContext } from "@/context/appContext";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Custom hook for user-related queries and mutations
// Naming follows the convention: useUsers for fetching, useCreateUser/useUpdateUser for mutations

interface NewUser {
  email: string;
  password: string;
  username: string;
  storeId: number;
  ref?: number;
}

export function useCreateUser() {
  const { api, storeId } = useAppContext();
  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (newUser: NewUser) => {
      if (!storeId) {
        throw new Error(
          "Store configuration not found. Please contact support."
        );
      }

      // Prepare payload with correct types and explicit interface for type safety
      const payload: {
        email: string;
        password: string;
        storeId: number;
        username: string;
        ref?: number;
      } = {
        email: newUser.email,
        password: newUser.password,
        storeId: Number(storeId), // Ensure storeId is a number
        username: newUser.username,
      };

      // Only add ref if it's a valid number
      if (newUser.ref && !isNaN(Number(newUser.ref))) {
        payload.ref = Number(newUser.ref);
      }

      const res = await api.post(`/users`, payload);

      if (!res.data.user) {
        // Log the response for debugging
        console.error("User creation failed. Response:", res.data);
        throw new Error(
          "Failed to create user: No user object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("User created successfully");
    },
    onError: (error: unknown) => {
      // Enhanced error extraction to handle various backend formats
      let errorMsg = "An unexpected error occurred";
      if (error instanceof AxiosError) {
        // Try to extract error from common backend formats
        const data = error.response?.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data?.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = "Failed to create user";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

interface LoginProps {
  email: string;
  password: string;
  storeId: number;
}
export function useUserLogin() {
  const { api, setUserInfo } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationKey: ["userLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/users/me`, {
        email: data.email,
        password: data.password,
        storeId: data.storeId,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login user: No response data received from server."
        );
      }
      // console.log("Login response:", res.data);
      return res.data;
    },
    onSuccess: async (data) => {
      const res = await api.get(`/stores/current-user`);
      // Set user info in context, which also persists it to IndexedDB.
      setUserInfo({
        ...res.data,
      });
      // Redirect to the appropriate dashboard. The user session is now active.
      router.push("/client/dashboard");
    },
    onError: (error: unknown) => {
      // Enhanced error extraction for better user feedback
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
            "Failed to login user: Server returned an unknown error format.";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

// get users
export function useGetUsers() {
  const { api, storeId } = useAppContext();
  return useQuery({
    queryKey: ["users", storeId],
    queryFn: async () => {
      // The 'withCredentials' option is now set globally in the API context.
      const res = await api.get<User[]>(`/users`, {});
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data;
    },
  });
}

// ! get user by id`
export function useGetUserById(id: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      if (!res.data) throw new Error("Failed to fetch user");
      `
        return res.data;`;
    },
  });
}

// ! get user affiliate data
export function useGetUserAffiliateData() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["userAffiliateData", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get(`/users/affiliate`);
      if (!res.data) throw new Error("Failed to fetch affiliate data");
      return res.data;
    },
  });
}

interface DeleteUsersProps {
  uids: string[];
}

//! delete multiple users
export function useDeleteMultipleUsers() {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeleteUsersProps) => {
      const res = await api.delete(`/users/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users", storeId] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete users");
      } else {
        toast.error("Failed to delete users");
      }
    },
  });
}

//! delete a single user

interface DeleteUserProps {
  uid: string;
}
export const useDeleteASingleUser = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteUserProps) => {
      const res = await api.delete(`/users`, {
        data: { uid: data.uid },
      });
      if (!res.data) throw new Error("Failed to delete user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete user");
      } else {
        toast.error("Failed to delete user");
      }
    },
  });
};

// update user info
interface UpdateUserProps {
  apiKey?: string;
  username?: string;
  email?: string;
  fullName?: string;
}

export function useUpdateUser() {
  const { api } = useAppContext();

  return useMutation({
    mutationFn: async (data: UpdateUserProps) => {
      const res = await api.patch(`/users`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update user");
      } else {
        toast.error("Failed to update user");
      }
    },
  });
}

interface UpdateUserByAdminProps {
  apiKey?: string;
  username?: string;
  email?: string;
  fullName?: string;
  balance?: string;
}

export function useUpdateUserByAdmin() {
  const { api, storeId } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateUserByAdminProps) => {
      const res = await api.patch(`/users/admin`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users", storeId] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update user");
      } else {
        toast.error("Failed to update user");
      }
    },
  });
}
