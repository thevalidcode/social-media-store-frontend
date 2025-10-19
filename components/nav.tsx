import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./mode-toggle";
import { useAppContext } from "@/context/appContext";

export default function Nav() {
  const { generalSetting, isStoreGeneralSettingsLoading } = useAppContext();

  if (isStoreGeneralSettingsLoading) return <div>Loading...</div>;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-transparent">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            {/* <img title="logo" src={generalSetting?.logoUrl || ""} /> */}
            <span className="font-medium text-xl">
              {generalSetting?.storeName || "Social Media Store"}
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/client/api-docs" className="text-sm">
            API
          </Link>
          <Link href="/client/blog" className="text-sm">
            Blog
          </Link>
          <Link href="/client/services" className="text-sm">
            Services
          </Link>
          <Link href="/client/faq" className="text-sm">
            Faq
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/signin">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100  cursor-pointer"
            >
              Sign In
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
