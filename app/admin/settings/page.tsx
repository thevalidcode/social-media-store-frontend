"use client";

import { ThemeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Palette, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import GeneralSettingsForm from "../components/general-setting";
import DesignSettingsForm from "../components/theme";
import { useRouter } from "next/navigation";

export default function SettingsDialogPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [activePage, setActivePage] = useState("general");
  const [historyPushed, setHistoryPushed] = useState(false);
  const router = useRouter();

  const headers = [
    {
      id: "1",
      label: "General",
      key: "general",
      component: GeneralSettingsForm,
      icon: Settings2,
    },
    {
      id: "2",
      label: "design",
      key: "design",
      component: DesignSettingsForm,
      icon: Palette,
    },
  ];

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      setIsOpen(false);
    };

    if (isOpen && !historyPushed) {
      window.history.pushState({ dialogPage: "settings" }, "");
      setHistoryPushed(true);
      window.addEventListener("popstate", handlePopState);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, historyPushed]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.push("/admin/users");
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 backdrop-blur-xs z-50" />}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="w-full h-full sm:max-w-[85%] sm:max-h-[85vh] flex flex-col border lg:ml-5">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
            <div className="w-full sm:w-1/4 sm:border-r border-b sm:border-b-0 p-2">
              <div className="flex flex-col gap-2">
                {headers.map((header) => (
                  <Button
                    key={header.id}
                    variant="ghost"
                    className={cn(
                      "justify-start gap-2 cursor-pointer",
                      activePage === header.key && "bg-accent"
                    )}
                    onClick={() => setActivePage(header.key)}
                  >
                    <header.icon className="h-4 w-4" />
                    <span className="capitalize">{header.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-full sm:w-3/4 overflow-auto">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {(() => {
                    const Component = headers.find(
                      (header) => header.key === activePage
                    )?.component;
                    return Component ? <Component /> : null;
                  })()}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <ThemeToggle />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
