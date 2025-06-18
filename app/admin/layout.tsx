"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo, useCallback } from "react";
import { AdminSidebar } from "./components/admin-sidebar";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AdminSidebar);

export default function AdminLayout({
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
          <SidebarTrigger />
          <Wrapper className="max-w-[90rem] md:py-5 dark:bg-background">
            {children}
          </Wrapper>
        </SidebarInset>
      </SidebarProvider>
    ),
    [children]
  );

  return renderLayout();
}
