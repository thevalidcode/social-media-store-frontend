"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Nav from "@/components/nav";
import Wrapper from "@/components/wrapper";
import { Footer } from "@/components/Footer";
import Loading from "../loading";
import { useAppContext } from "@/context/appContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, error, userInfo, generalSetting } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

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
  }, [error, isLoading, pathname, router, userInfo]);

  useEffect(() => {
    document.title = generalSetting?.storeName || "Loading…";
  }, [generalSetting]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Nav />
      <div>{children}</div>
      <Footer />
    </Wrapper>
  );
}
