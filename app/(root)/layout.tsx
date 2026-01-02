"use client";

import Nav from "@/components/nav";
import Wrapper from "@/components/wrapper";
import { useAppContext } from "@/context/appContext";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, error, userInfo, generalSetting } = useAppContext();

  const router = useRouter();

  if (isLoading) <Loading />;

  const pathname = window.location.pathname;
  useEffect(() => {
    if (!isLoading && !error && userInfo) {
      const excludePaths = [
        "/auth/forgot-password",
        "/auth/reset-password",
        "/terms-of-service",
        "/privacy-policy",
      ];

      if (!excludePaths.some((path) => pathname.includes(path))) {
        router.push("/client/dashboard");
      }
    }
  }, [isLoading, error, userInfo, pathname]);

  useEffect(() => {
    if (generalSetting) {
      document.title = `${generalSetting.storeName}`;
    } else {
      document.title = "Loading…";
    }
  }, [generalSetting]);

  return (
    <Wrapper>
      <Nav />
      {children}
    </Wrapper>
  );
}
