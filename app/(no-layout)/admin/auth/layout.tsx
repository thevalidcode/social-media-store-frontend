"use client";

import { useEffect } from "react";
import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

export default function NoLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, error, adminInfo } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !error && adminInfo) {
      router.push("/admin/users");
    }
  }, [isLoading, error, adminInfo, router]);

  if (isLoading) return <Loading />;

  return <>{children}</>;
}
