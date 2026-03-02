"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/appContext";
import { ThemeToggle } from "./mode-toggle";

export default function Nav() {
  const { generalSetting, isStoreGeneralSettingsLoading } = useAppContext();
  const [open, setOpen] = useState(false);

  const logo = generalSetting?.logoUrl;
  const title = generalSetting?.storeName || "Social Media Store";

  if (isStoreGeneralSettingsLoading) {
    return <header className="p-6 border-b text-center"></header>;
  }

  return (
    <>
      {/* Desktop + Mobile Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={title}
                className="w-10 h-10 rounded-xl object-cover border border-primary/20 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                S
              </div>
            )}

            <span className="text-xl font-semibold tracking-tight text-primary">
              {title}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10 text-sm">
            <Link
              className="hover:text-primary transition"
              href="/client/api-docs"
            >
              API
            </Link>
            <Link className="hover:text-primary transition" href="/client/blog">
              Blog
            </Link>
            <Link
              className="hover:text-primary transition"
              href="/client/services"
            >
              Services
            </Link>
            <Link className="hover:text-primary transition" href="/client/faq">
              FAQ
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/signin">
              <Button className="cursor-pointer">Sign In</Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu icon */}
          <Button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg border border-border hover:bg-muted transition"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>

      {/* Full-screen mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-background/95 backdrop-blur-xl"
          >
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="absolute right-0 top-0 h-full w-[80%] bg-background border-l shadow-xl px-8 py-10 flex flex-col"
            >
              {/* Close */}
              <Button
                onClick={() => setOpen(false)}
                className="self-end mb-10 p-2 rounded-lg border hover:bg-muted transition"
              >
                <X size={22} />
              </Button>

              {/* Branding */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 mb-12"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={title}
                    className="w-12 h-12 rounded-xl object-cover border border-primary/20 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                    S
                  </div>
                )}
                <span className="text-2xl font-semibold text-primary">
                  {title}
                </span>
              </Link>

              {/* Navigation links */}
              <div className="flex flex-col gap-8 text-lg font-medium">
                <Link href="/client/api-docs" onClick={() => setOpen(false)}>
                  API
                </Link>
                <Link href="/client/blog" onClick={() => setOpen(false)}>
                  Blog
                </Link>
                <Link href="/client/services" onClick={() => setOpen(false)}>
                  Services
                </Link>
                <Link href="/client/faq" onClick={() => setOpen(false)}>
                  FAQ
                </Link>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-10 flex flex-col gap-6">
                <Link href="/auth/signin" onClick={() => setOpen(false)}>
                  <Button className="w-full py-6 text-lg cursor-pointer">
                    Sign In
                  </Button>
                </Link>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
