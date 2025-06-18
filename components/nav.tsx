import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./mode-toggle";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-transparent">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-kn1C5CDk5zUaYa4BHkG1FKUQupEsrm.png"
              alt="Crop Studio"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-medium ">Crop Studio</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/client/api-page" className="text-sm  ">
            API
          </Link>
          <Link href="/client/blog" className="text-sm  ">
            Blog
          </Link>
          <Link href="/client/services" className="text-sm  ">
            Services
          </Link>
          <Link href="/client/faq" className="text-sm  ">
            Faq
          </Link>
          <Link href="/client/contact" className="text-sm  ">
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/signin">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100"
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
