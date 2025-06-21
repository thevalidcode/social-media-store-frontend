"use client";
import { useAppContext } from "@/context/appContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Custom hook for user-related queries and mutations
// Naming follows the convention: useUsers for fetching, useCreateUser/useUpdateUser for mutations

interface NewUser {
  email: string;
  password: string;
  panel_id: number;
  ref?: number;
  username: string;
}

export function useCreateUser() {
  const { apiUrl, panel_id } = useAppContext(); // moved inside hook to follow React rules
  const router = useRouter();
  return useMutation({
    mutationKey: ["createUser", panel_id],
    mutationFn: async (newUser: NewUser) => {
      // Validate panel_id is available
      if (!panel_id) {
        throw new Error("Panel configuration not found");
      }

      const res = await axios.post(`${apiUrl}/user`, {
        email: newUser.email,
        password: newUser.password,
        panel_id: newUser.panel_id, // Use the passed panel_id (already converted to number)
        username: newUser.username,
        ref: newUser.ref || null,
      });
      if (!res.data) throw new Error("Failed to create user");
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User created successfully");
      router.push("/auth/signin");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to create user");
      } else {
        toast.error("Failed to create user");
      }
    },
  });
}

// get users
export function useGetUsers() {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/user`);
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data;
    },
  });
}

// ! get user by id`
export function useGetUserById(id: string) {
  const { apiUrl } = useAppContext();
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/user/${id}`);
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data;
    },
  });
}

interface DeleteUsersProps {
  uids: string[];
}

//! delete multiple users
export function useDeleteMultipleUsers() {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteUsersProps) => {
      const res = await axios.delete(`${apiUrl}/user`, { data });
      if (!res.data) throw new Error("Failed to delete users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users deleted successfully");
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
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteUserProps) => {
      try {
        const res = await axios.delete(`${apiUrl}/user`, {
          data: { uid: data.uid },
        });
        if (!res.data) throw new Error("Failed to delete user");
        return res.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.error || "Failed to delete user"
          );
        }
      }
    },
  });
};

// update user info

interface UpdateUserProps {
  uid: string;
  username: string;
  email: string;
  full_name: string;
  balance: number;
}

export function useUpdateUser() {
  const { apiUrl } = useAppContext();
  return useMutation({
    mutationFn: async (data: UpdateUserProps) => {
      const res = await axios.put(`${apiUrl}/user`, data);
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
