"use client";

import { useEffect } from "react";
import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

export default function NoLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, error, adminInfo } = useAppContext();
  const router = useRouter();

  const pathname = window.location.pathname;
  useEffect(() => {
    if (!isLoading && !error && adminInfo) {
      const excludePaths = [
        "/admin/auth/forgot-password",
        "/admin/auth/reset-password",
      ];

      if (!excludePaths.some((path) => pathname.includes(path))) {
        router.push("/admin/users");
      }
    }
  }, [isLoading, error, adminInfo, pathname]);

  if (isLoading) return <Loading />;

  return <>{children}</>;
}
