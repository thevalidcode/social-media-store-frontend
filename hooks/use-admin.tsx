"use client";
import { useAppContext } from "@/context/appContext";
import { Admin, AdminStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation } from "@tanstack/react-query";
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
      return res.data.admin;
    },
    onSuccess: async (data) => {
      setAdminInfo({
        ...data,
      });
      router.push("/admin/users");
      toast.success("Admin logged in successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to login admin");
      toast.error(errorMsg);
    },
  });
}

// update admin info
interface UpdateAdminProps {
  username?: string;
  apiKey?: string;
  fullName?: string;
  image?: string;
  status?: AdminStatus;
}

export function useUpdateAdmin() {
  const { api, setAdminInfo } = useAppContext();
  return useMutation({
    mutationFn: async (data: UpdateAdminProps) => {
      const res = await api.patch(`/admins`, data);
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: (updatedAdmin: any) => {
      toast.success("Admin updated successfully");
      setAdminInfo({
        ...updatedAdmin.admin,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update admin");
      toast.error(errorMsg);
    },
  });
}

// update onboarding completed status
export function useUpdateOnboardingCompleted() {
  const { api, setAdminInfo } = useAppContext();
  return useMutation({
    mutationFn: async () => {
      const res = await api.put(`/admins/onboarding-completed`);
      if (!res.data) throw new Error("Failed to update onboarding status");
      return res.data.admin;
    },
    onSuccess: (updatedAdmin: Admin) => {
      setAdminInfo({
        ...updatedAdmin,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update onboarding status"
      );
      toast.error(errorMsg);
    },
  });
}

interface ForgetPasswordProps {
  email: string;
}

export function useForgotPassword() {
  const { api, storeId } = useAppContext();
  return useMutation({
    mutationFn: async (data: ForgetPasswordProps) => {
      const res = await api.post(
        `/admins/forgot-password?storeId=${storeId}`,
        data
      );
      if (!res.data) throw new Error("Failed to send email");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to send email");
      toast.error(errorMsg);
    },
  });
}

interface ResetPasswordProps {
  token: string;
  email: string;
  password: string;
}

export function useResetPassword() {
  const { api, storeId } = useAppContext();
  return useMutation({
    mutationFn: async (data: ResetPasswordProps) => {
      const res = await api.post(
        `/admins/reset-password?storeId=${storeId}`,
        data
      );
      if (!res.data) throw new Error("Failed to reset password");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to reset password");
      toast.error(errorMsg);
    },
  });
}

interface VerifySessionCodeProps {
  sessionCode: string;
}

export function useVerifySessionCode() {
  const { storeId, setAdminInfo, api } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: VerifySessionCodeProps) => {
      if (!api) {
        throw new Error("API client not initialized. Please wait...");
      }
      const res = await api.post<{ admin: Admin }>(
        `/admins/verify-session`,
        { ...data, storeId },
        {
          withCredentials: true,
        }
      );
      if (!res.data.admin) throw new Error("Failed to verify session");
      return res.data.admin;
    },
    onSuccess: (data) => {
      toast.success("Admin authenticated successfully");
      setAdminInfo(data);
      router.push("/admin/users");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to verify session");
      toast.error(errorMsg);
    },
  });
}
