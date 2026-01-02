"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Settings2,
  Palette,
  Shield,
  Menu,
  FileText,
} from "lucide-react";
import { useState } from "react";
import GeneralSettingsForm from "../components/general-setting";
import DesignSettingsForm from "../components/theme";
import PageManager from "../components/pages/PageManager";
import { useRouter } from "next/navigation";
import { TypographyH2 } from "@/components/typography";

export default function SettingsPage() {
  const [activePage, setActivePage] = useState("general");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navigationItems = [
    {
      id: "general",
      label: "General",
      description: "Store settings and basic configuration",
      icon: Settings2,
      component: GeneralSettingsForm,
    },
    {
      id: "design",
      label: "Design",
      description: "Theme and appearance customization",
      icon: Palette,
      component: DesignSettingsForm,
    },
    {
      id: "pages",
      label: "Pages",
      description: "Manage page content and policies",
      icon: FileText,
      component: PageManager,
    },
    {
      id: "security",
      label: "Security",
      description: "Security and access management",
      icon: Shield,
      component: () => (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <TypographyH2 className="text-xl mb-2">
              Security Settings
            </TypographyH2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      ),
    },
  ];

  const activeItem = navigationItems.find((item) => item.id === activePage);
  const ActiveComponent = activeItem?.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden  border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <TypographyH2 className="text-lg">Settings</TypographyH2>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-6">
                  <TypographyH2 className="mb-6">Settings</TypographyH2>
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activePage === item.id;

                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 h-auto p-4 text-left overflow-hidden",
                              isActive &&
                                "bg-secondary shadow-sm border border-border/50"
                            )}
                            onClick={() => {
                              setActivePage(item.id);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3 w-full overflow-hidden">
                              <div
                                className={cn(
                                  "p-2 rounded-lg transition-colors shrink-0",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>

                              {/* THIS is where truncation must happen */}
                              <div className="flex flex-col min-w-0 overflow-hidden">
                                <div
                                  className={cn(
                                    "font-medium text-sm truncate",
                                    isActive
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {item.label}
                                </div>

                                <div className="mt-0.5 text-xs text-muted-foreground truncate">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block w-full max-w-xs"
          >
            <div className="sticky top-24">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-auto p-4 text-left",
                          isActive &&
                            "bg-secondary shadow-sm border border-border/50"
                        )}
                        onClick={() => setActivePage(item.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-medium text-sm",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[600px]"
                >
                  <ScrollArea className="h-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                      {ActiveComponent && <ActiveComponent />}
                    </div>
                  </ScrollArea>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
