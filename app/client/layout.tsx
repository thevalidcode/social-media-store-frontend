"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo, useEffect } from "react";
import { TopNav } from "./component/nav";
import withAuth from "@/lib/withAuth";
import { useGetUserByUid } from "@/hooks/use-user";
import { useAppContext } from "@/context/appContext";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AppSidebar);

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { userInfo, setUserInfo } = useAppContext();
  const { data: userData } = useGetUserByUid(userInfo?.uid || "");

  useEffect(() => {
    if (userData) {
      // Merge with userData overriding userInfo fields
      setUserInfo({
        ...userInfo,
        ...userData,
      });
    }
  }, [userData]);

  return (
    <SidebarProvider>
      <MemoizedSidebar />
      <SidebarInset>
        <TopNav />
        <Wrapper className="max-w-[90rem] md:py-5 mt-6">{children}</Wrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Export the wrapped component as the default export for the layout
export default withAuth({
  WrappedComponent: SidebarLayout,
  userType: "user",
  excludePaths: [
    "/client/services",
    "/client/faq",
    "/client/blog",
    "/client/api-docs",
  ],
});
