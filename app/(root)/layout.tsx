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
  const { isLoading, error, userInfo } = useAppContext();

  const router = useRouter();

  if (isLoading) <Loading />;

  useEffect(() => {
    if (!isLoading && !error && userInfo) {
      router.push("/client/dashboard");
    }
  }, [isLoading, error, userInfo, router]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Wrapper>
      <Nav />
      {children}
    </Wrapper>
  );
}
