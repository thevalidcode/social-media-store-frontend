"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo, useCallback } from "react";
import { TopNav } from "./component/nav";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AppSidebar);

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize the layout structure
  const renderLayout = useCallback(
    () => (
      <SidebarProvider>
        <MemoizedSidebar />
        <SidebarInset>
          <TopNav />
          <Wrapper className="max-w-[90rem] md:py-5">{children}</Wrapper>
        </SidebarInset>
      </SidebarProvider>
    ),
    [children]
  );

  return renderLayout();
}
