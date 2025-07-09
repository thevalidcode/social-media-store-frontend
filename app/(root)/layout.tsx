"use client";

import Nav from "@/components/nav";
import Wrapper from "@/components/wrapper";
import { useAppContext } from "@/context/appContext";
import Loading from "../loading";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, error } = useAppContext();

  if (isLoading) <Loading />;

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
