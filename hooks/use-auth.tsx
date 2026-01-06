"use client";
import { useAppContext } from "@/context/appContext";
import { User } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VerifySessionCodeProps {
  sessionCode: string;
}

export function useVerifySessionCode() {
  const { storeId, setUserInfo } = useAppContext();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: VerifySessionCodeProps) => {
      const res = await axios.post<{ user: User }>(
        `/api/auth/social-media-store/session/verify`,
        { ...data, storeId }
      );
      if (!res.data.user) throw new Error("Failed to verify session code");
      return res.data.user;
    },
    onSuccess: (data) => {
      toast.success("User authenticated successfully");
      setUserInfo({
        ...data,
      });
      // Redirect to the appropriate dashboard. The user session is now active.
      router.push("/client/dashboard");
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
