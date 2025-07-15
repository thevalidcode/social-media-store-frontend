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
  // const { apiUrl, panel_id } = useAppContext();
  //
  // const { isLoading, error } = useQuery({
  //   queryKey: ["site_styles"],
  //   queryFn: async () => {
  //     const res = await axios.get(
  //       `${apiUrl}/panel/styles?panel_id=${panel_id}`
  //     );
  //     if (!res.data) {
  //       return;
  //     }
  //     localStorage.setItem("site_styles", res.data);
  //   },
  //   enabled: typeof window !== "undefined" && !panel_id,
  // });
  //
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
    [children],
  );

  // Check loading state after all hooks have been called
  return renderLayout();
}
