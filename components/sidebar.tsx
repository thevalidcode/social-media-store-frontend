"use client";

import {
  Bell,
  BookOpen,
  Code,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  // Mail,
  Menu,
  PlusIcon,
  //  MessageSquare,
  Search,
  Server,
  Settings,
  ShoppingCart,
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
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TypographyInlineCode } from "./typography";

// Navigation data
const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/client/dashboard",
        icon: LayoutDashboard,
      },

      {
        title: "Services",
        url: "/client/services",
        icon: Server,
      },
      {
        title: "New Order",
        url: "/client/new-order",
        icon: PlusIcon,
      },
      {
        title: "My Orders",
        url: "/client/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Blogs",
    items: [
      {
        title: "Blogs",
        url: "/client/blog",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Sign In",
        url: "/auth/signin",
        icon: LogIn,
      },
      {
        title: "Sign Up",
        url: "/auth/signup",
        icon: UserPlus,
      },
      {
        title: "My Profile",
        url: "/client/profile",
        icon: User,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "Deposit",
        url: "/client/add-funds",
        icon: CreditCard,
      },
      {
        title: "Invite Friends",
        url: "/client/referral",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      {
        title: "FAQ",
        url: "/client/faq",
        icon: HelpCircle,
      },
      {
        title: "Contact Support",
        url: "/client/support",
        icon: HelpCircle,
      },

      {
        title: "API Docs",
        url: "/client/api-page",
        icon: Code,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path;
  };
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="md" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Menu className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sm">
                    <TypographyInlineCode>My App</TypographyInlineCode>
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <SidebarInput
                id="search"
                placeholder="Search..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton size="md" asChild>
                      <Link
                        href={item.url}
                        className={
                          isActive(item.url)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
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
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sm">
                      John Doe
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      john@example.com
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
                        src="https://github.com/shadcn.png"
                        alt="User"
                      />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-sm">
                        John Doe
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        john@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
