"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  LayoutGrid,
  Menu,
  MessageSquare,
  Server,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/appContext";
import { ThemeToggle } from "./mode-toggle";

export default function Nav() {
  const { generalSetting, isStoreGeneralSettingsLoading, storeInfo, userInfo } =
    useAppContext();
  const [open, setOpen] = useState(false);

  const logo = generalSetting?.logoUrl;
  const title = generalSetting?.storeName || "Social Media Store";
  const isAuthenticated = !!userInfo;
  const apiAccessAllowed = storeInfo?.features?.api_access ?? false;

  const navItems = [
    { href: "/client/services", label: "Services", icon: Server },
    { href: "/client/new-order", label: "New Order", icon: LayoutGrid },
    {
      href: "/client/add-funds",
      label: "Add Funds",
      icon: CreditCard,
      authOnly: true,
    },
    {
      href: "/client/support",
      label: "Support",
      icon: MessageSquare,
      authOnly: true,
    },
    ...(apiAccessAllowed
      ? [{ href: "/client/api-docs", label: "API Docs", icon: Server }]
      : []),
  ].filter((item) => !item.authOnly || isAuthenticated);

  if (isStoreGeneralSettingsLoading) {
    return (
      <header className="h-20 border-b bg-background/80 backdrop-blur-xl" />
    );
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={title}
                className="h-10 w-10 rounded-2xl border border-primary/15 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-sm font-semibold text-primary">
                {title.charAt(0) || "S"}
              </div>
            )}
            <div className="leading-tight">
              <p className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Link href="/client/dashboard">
                <Button variant="outline" className="cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button className="cursor-pointer">Sign In</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            size="icon"
            className="md:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-background/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="absolute right-0 top-0 flex h-full w-[86%] flex-col border-l bg-background px-6 py-6 shadow-2xl sm:w-[72%]"
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={title}
                      className="h-10 w-10 rounded-2xl border border-primary/15 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-sm font-semibold text-primary">
                      {title.charAt(0) || "S"}
                    </div>
                  )}
                  <span className="text-lg font-semibold tracking-tight">
                    {title}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 px-4 py-4 text-base font-medium transition-colors hover:bg-muted"
                  >
                    <span>{item.label}</span>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-4 pt-8">
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Theme</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Toggle appearance
                    </span>
                    <ThemeToggle />
                  </div>
                </div>

                {isAuthenticated ? (
                  <Link href="/client/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full py-6 text-base">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signin" onClick={() => setOpen(false)}>
                    <Button className="w-full py-6 text-base">Sign In</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
