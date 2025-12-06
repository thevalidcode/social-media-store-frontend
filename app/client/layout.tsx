"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo, useCallback } from "react";
import { TopNav } from "./component/nav";
import withAuth from "@/lib/withAuth";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AppSidebar);

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const renderLayout = useCallback(
    () => (
      <SidebarProvider>
        <MemoizedSidebar />
        <SidebarInset>
          <TopNav />
          <Wrapper className="max-w-[90rem] md:py-5 mt-6">{children}</Wrapper>
        </SidebarInset>
      </SidebarProvider>
    ),
    [children]
  );

  // Check loading state after all hooks have been called
  return renderLayout();
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
