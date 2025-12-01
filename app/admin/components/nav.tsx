"use client";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { CreditCard, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppContext } from "@/context/appContext";

export function TopNav() {
  const { generalSetting } = useAppContext();

  return (
    <header className="sticky top-0 z-40 border-b bg-transparent backdrop-blur-xl">
      <Wrapper className="max-w-[100rem] flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Sidebar trigger */}
        <SidebarTrigger />

        {/* Center: Mobile brand */}
        <div className="flex md:hidden flex-1 justify-center">
          <Link href="/" className="flex items-center gap-2">
            {generalSetting?.logoUrl ? (
              <img
                src={generalSetting?.logoUrl}
                alt={generalSetting?.storeName}
                className="w-8 h-8 rounded-md object-cover border border-primary/20 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                S
              </div>
            )}
            <span className="text-lg font-semibold">
              {generalSetting?.storeName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex items-center justify-between gap-4">
            <>
              <Link href="/admin/orders">
                <Button
                  variant="outline"
                  className="rounded-lg cursor-pointer"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </Link>

              <Link href="/admin/payment-methods">
                <Button className="rounded-lg cursor-pointer" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
              </Link>
            </>
          </nav>
        </div>

        {/* Right: Theme toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </Wrapper>
    </header>
  );
}
