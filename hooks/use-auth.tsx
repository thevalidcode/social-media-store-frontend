"use client";
import { useAppContext } from "@/context/appContext";
import { User, Admin } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VerifySessionCodeProps {
  sessionCode: string;
}

type Role = "USER" | "ADMIN";
type AuthResponse = User | Admin;

export function useVerifySessionCode(role: Role = "USER") {
  const { storeId, setUserInfo, setAdminInfo } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: VerifySessionCodeProps) => {
      const res = await axios.post<{ user: AuthResponse }>(
        `https://auth.validpanel.com/api/auth/social-media-store/session/verify`,
        { ...data, storeId, role }
      );
      if (!res.data.user) throw new Error("Failed to verify session code");
      return res.data.user;
    },
    onSuccess: (data: AuthResponse) => {
      toast.success("User authenticated successfully");
      if (role === "USER") {
        setUserInfo(data as User);
        router.push("/client/dashboard");
      } else {
        setAdminInfo(data as Admin);
        router.push("/admin/users");
      }
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to verify session code"
      );
      toast.error(errorMsg);
    },
  });
}
