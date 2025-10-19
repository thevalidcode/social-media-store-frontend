"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo } from "react";
import { AdminSidebar } from "./components/admin-sidebar";
import withAuth from "@/lib/withAuth";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AdminSidebar);

// This is the actual layout component that will be wrapped by withAuth
function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MemoizedSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <Wrapper className="max-w-[90rem] md:py-5">{children}</Wrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Export the wrapped component as the default export for the layout
export default withAuth({
  WrappedComponent: AdminLayoutComponent,
  userType: "admin",
});
