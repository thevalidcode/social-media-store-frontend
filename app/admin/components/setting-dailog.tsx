import { ThemeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  CreditCard,
  FileText,
  HelpCircle,
  Link2,
  Palette,
  Server,
  Settings,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import AdminPages from "./admin-pages";
import AdminPayment from "./admin-payment";
import AdminProviders from "./admin-providers";
import GeneralSettingsForm from "./general-setting";
import Integration from "./integration";
import DesignSettingsForm from "./theme";
import AdminFaq from "./admin-faq";

export function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("payment");

  const headers = [
    {
      id: "1",
      label: "payment method",
      key: "payment",
      component: AdminPayment,
      icon: CreditCard,
    },
    {
      id: "2",
      label: "General",
      key: "general",
      component: GeneralSettingsForm,
      icon: Settings2,
    },
    {
      id: "3",
      label: "Providers",
      key: "providers",
      component: AdminProviders,
      icon: Server,
    },
    {
      id: "4",
      label: "pages",
      key: "pages",
      component: AdminPages,
      icon: FileText,
    },
    {
      id: "5",
      label: "faq",
      key: "faq",
      component: AdminFaq,
      icon: HelpCircle,
    },
    {
      id: "6",
      label: "design",
      key: "design",
      component: DesignSettingsForm,
      icon: Palette,
    },
    {
      id: "7",
      label: "integration",
      key: "integration",
      component: Integration,
      icon: Link2,
    },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 backdrop-blur-xs z-50" />}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="w-full ">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings />
            <span>Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[85%] h-[85vh] max-h-[85vh] flex flex-col border lg:ml-20">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/4 border-r p-4">
              <div className="flex flex-col gap-2">
                {headers.map((header) => (
                  <Button
                    key={header.id}
                    variant="ghost"
                    className={cn(
                      "justify-start gap-2 cursor-pointer",
                      activePage ===
                        (typeof header.key === "string"
                          ? header.key
                          : "general") && "bg-accent"
                    )}
                    onClick={() =>
                      setActivePage(
                        typeof header.key === "string" ? header.key : "general"
                      )
                    }
                  >
                    <header.icon className="h-4 w-4" />
                    <span className="capitalize">{header.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-3/4 overflow-auto">
              <ScrollArea className="h-full">
                {typeof headers.find(
                  (header) =>
                    (typeof header.key === "string"
                      ? header.key
                      : "general") === activePage
                )?.key === "string" ? (
                  <div className="p-6">
                    {(() => {
                      const Component = headers.find(
                        (header) => header.key === activePage
                      )?.component;
                      return Component ? <Component /> : null;
                    })()}
                  </div>
                ) : (
                  <GeneralSettingsForm />
                )}
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
