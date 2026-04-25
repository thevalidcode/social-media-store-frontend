"use client";

import {
  BookOpen,
  Code,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  PlusIcon,
  Server,
  ShoppingCart,
  Trash2,
  User,
  UserPlus,
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
import { useGetUserCancellations } from "@/hooks/use-cancellations";
import { Badge } from "@/components/ui/badge";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const {
    generalSetting,
    isStoreGeneralSettingsLoading,
    userInfo,
    setUserInfo,
    storeInfo,
  } = useAppContext();

  // Get user cancellations count
  const { data: userCancellations } = useGetUserCancellations();
  const cancellationCount = userCancellations?.length || 0;

  const isActive = (path: string) => pathname === path;

  // Compute authentication status explicitly
  const isAuthenticated = !!userInfo;

  const analyticsAllowed = storeInfo?.features?.analytics ?? false;
  const apiAccessAllowed = storeInfo?.features?.api_access ?? false;

  const publicRoutes = [
    "/client/services",
    "/client/faq",
    "/client/blog",
    ...(apiAccessAllowed ? ["/client/api-docs"] : []),
  ];

  // Full navigation definition
  const baseNavigation = [
    {
      title: "Overview",
      items: [
        analyticsAllowed && {
          title: "Dashboard",
          url: "/client/dashboard",
          icon: LayoutDashboard,
        },
        { title: "Services", url: "/client/services", icon: Server },
        { title: "New Order", url: "/client/new-order", icon: PlusIcon },
        { title: "My Orders", url: "/client/orders", icon: ShoppingCart },
        cancellationCount > 0 && {
          title: "Cancellations",
          url: "/client/cancellations",
          icon: Trash2,
          badge: cancellationCount,
        },
      ],
    },
    {
      title: "Blogs",
      items: [{ title: "Blog", url: "/client/blog", icon: BookOpen }],
    },
    {
      title: "Payments",
      items: [
        { title: "Deposit", url: "/client/add-funds", icon: CreditCard },
        { title: "Invite Friends", url: "/client/referral", icon: UserPlus },
      ],
    },
    {
      title: "Help & Support",
      items: [
        { title: "FAQ", url: "/client/faq", icon: HelpCircle },
        {
          title: "Contact Support",
          url: "/client/support",
          icon: MessageSquare,
        },
        apiAccessAllowed && {
          title: "API Docs",
          url: "/client/api-docs",
          icon: Code,
        },
      ],
    },
  ];

  // Filter navigation dynamically
  const navigationItems = baseNavigation
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        // Remove falsy items (from conditional rendering)
        if (!item) return false;
        // Hide private-only routes when user is NOT authenticated
        if (!isAuthenticated && !publicRoutes.includes(item.url)) {
          return false;
        }
        return true;
      });
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0); // Remove empty groups

  if (isStoreGeneralSettingsLoading) return null;

  const handleAuthAction = async () => {
    if (userInfo) {
      setUserInfo(null);
      await del("userInfo"); // User is logging out
      router.push("/");
    } else {
      router.push("/auth/signin");
    }
  };
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="md" asChild>
              <Link href="/">
                {generalSetting?.logoUrl && (
                  <Image
                    src={generalSetting.logoUrl}
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
        {navigationItems.map((group) => (
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
                          {item.badge && item.badge > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badge}
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
                      src={userInfo?.image || "https://github.com/shadcn.png"}
                      alt="User"
                    />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sm">
                      {userInfo?.fullName || "Guest User"}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {userInfo?.email || "Not signed in"}
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
                        src={userInfo?.image || "https://github.com/shadcn.png"}
                        alt="User"
                      />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-sm">
                        {userInfo?.fullName || "Guest User"}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {userInfo?.email || "Not signed in"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userInfo && (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/client/profile")}
                    >
                      <User />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleAuthAction}>
                  <LogIn />
                  {userInfo ? "Log out" : "Sign in"}
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
