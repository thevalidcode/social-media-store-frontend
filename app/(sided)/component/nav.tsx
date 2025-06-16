"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Notifications } from "./notiifcation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center justify-between gap-4">
            <div>
              <Link href="/orders">
                <Button
                  variant="outline"
                  className="rounded-lg cursor-pointer"
                  size="sm"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/add-funds">
                <Button className="rounded-lg cursor-pointer" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
