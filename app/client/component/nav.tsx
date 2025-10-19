"use client";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { PlusIcon, WalletIcon, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Notifications } from "./notiifcation";
import { ThemeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppContext } from "@/context/appContext";

export function TopNav() {
  const { userInfo } = useAppContext();
  const isAuthenticated = !!userInfo;

  return (
    <header className="sticky top-0 z-40 border-b bg-transparent backdrop-blur-xl">
      <Wrapper className="max-w-[100rem] flex h-16 items-center justify-between px-4 md:px-6">
        <SidebarTrigger />

        <div className="hidden md:block">
          <nav className="flex items-center justify-between gap-4">
            {isAuthenticated ? (
              <>
                {/* Logged-in user buttons */}
                <Link href="/client/new-order">
                  <Button
                    variant="outline"
                    className="rounded-lg cursor-pointer"
                    size="lg"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Order
                  </Button>
                </Link>

                <Link href="/client/add-funds">
                  <Button className="rounded-lg cursor-pointer" size="lg">
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Logged-out visitor buttons */}
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="rounded-lg cursor-pointer"
                    size="lg"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button className="rounded-lg cursor-pointer" size="lg">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Notifications />
          <ThemeToggle />
        </div>
      </Wrapper>
    </header>
  );
}
