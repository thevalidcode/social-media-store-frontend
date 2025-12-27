"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Wrapper from "@/components/wrapper";
import { memo, useState, useEffect } from "react";
import { AdminSidebar } from "./components/admin-sidebar";
import withAuth from "@/lib/withAuth";
import { TopNav } from "./components/nav";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useAppContext } from "@/context/appContext";

// Memoize the sidebar to prevent re-renders
const MemoizedSidebar = memo(AdminSidebar);

// This is the actual layout component that will be wrapped by withAuth
function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
  const { adminInfo } = useAppContext();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (adminInfo && !adminInfo.onboardingCompleted) {
      setShowTour(true);
    }
  }, [adminInfo]);

  return (
    <SidebarProvider>
      <MemoizedSidebar />
      <SidebarInset>
        <TopNav />
        <Wrapper className="max-w-[90rem] md:py-5 md:px-5 px-3 mt-6">
          {children}
        </Wrapper>
      </SidebarInset>
      <OnboardingTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </SidebarProvider>
  );
}

// Export the wrapped component as the default export for the layout
export default withAuth({
  WrappedComponent: AdminLayoutComponent,
  userType: "admin",
});
