import { AppSidebar } from "@/components/sidebar"; // Fixed import path to match actual file location
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "./component/nav";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Changed function name to Layout to match file name
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
