"use client";

import {
  BarChart,
  BookOpen,
  CreditCard,
  Folder,
  HelpCircle,
  LogIn,
  MessageCircle,
  Network,
  Settings,
  Shield,
  ShoppingCart,
  Trash2,
  User,
  Users,
} from "lucide-react";
import type * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import Image from "next/image";
import { del } from "idb-keyval";
import { useGetAllCancellations } from "@/hooks/use-cancellations";
import { Badge } from "@/components/ui/badge";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Get all cancellations count
  const { data: allCancellations } = useGetAllCancellations();
  const pendingCount =
    allCancellations?.filter((cancel) => cancel.status === "PENDING").length ||
    0;

  const allCount = allCancellations?.length || 0;

  // Admin navigation data
  const adminNavigationItems = [
    {
      title: "Management",
      items: [
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: ShoppingCart,
        },
        allCount > 0 && {
          title: "Cancellations",
          url: "/client/cancellations",
          icon: Trash2,
          badge: allCount,
        },
        {
          title: "Services",
          url: "/admin/services",
          icon: Shield,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: Folder,
        },
        { title: "Providers", url: "/admin/providers", icon: Network },
      ],
    },
    {
      title: "Content",
      items: [
        {
          title: "Blogs",
          url: "/admin/blogs",
          icon: BookOpen,
        },
        {
          title: "Support",
          url: "/admin/support",
          icon: MessageCircle,
        },
        {
          title: "FAQs",
          url: "/admin/faqs",
          icon: HelpCircle,
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: BarChart,
        },
        {
          title: "Payments",
          url: "/admin/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Payment Methods",
          url: "/admin/payment-methods",
          icon: CreditCard,
        },
        { title: "Settings", url: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const router = useRouter();

  const {
    generalSetting,
    isStoreGeneralSettingsLoading,
    adminInfo,
    setAdminInfo,
  } = useAppContext();

  if (isStoreGeneralSettingsLoading) return null;

  const handleAuthAction = async () => {
    setAdminInfo(null);
    await del("adminInfo");
    router.push("/admin/auth/signin");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="md" asChild>
              <Link href="/admin/users">
                {generalSetting?.logoUrl && (
                  <Image
                    src={generalSetting?.logoUrl || ""}
                    alt="logo"
                    width={32}
                    height={32}
                    className="rounded-sm"
                  />
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-md">
                    {generalSetting?.storeName || "Social Media Store"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {adminNavigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items
                  .filter((item) => !!item)
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton size="md" asChild>
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                          className={
                            isActive(item.url)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }
                        >
                          <item.icon />
                          <span className="flex-1">{item.title}</span>
                          {item.title === "Cancellations" &&
                            pendingCount > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {pendingCount}
                              </Badge>
                            )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="md"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={adminInfo?.image || "https://github.com/shadcn.png"}
                      alt="Admin"
                    />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {adminInfo?.fullName || " Admin User"}
                    </span>
                    <span className="truncate text-xs">
                      {adminInfo?.email || "admin@validpanel.com"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          adminInfo?.image || "https://github.com/shadcn.png"
                        }
                        alt="Admin"
                      />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {adminInfo?.fullName || "Admin User"}
                      </span>
                      <span className="truncate text-xs">
                        {adminInfo?.email || "admin@validpanel.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                  <User />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuthAction}>
                  <LogIn />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
