import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./mode-toggle";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-transparent">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.343 2.65705L20 0L40 20L20 40L17.3429 37.3429L34.6859 20L17.343 2.65705Z"
                fill="#D41C1C"
              ></path>
              <path
                d="M13.8744 6.12564L16.5314 3.46859L33.0628 20L16.5314 36.5314L13.8744 33.8744L27.7487 20L13.8744 6.12564Z"
                fill="#D41C1C"
              ></path>
              <path
                d="M0 20L13.0628 6.93718L26.1256 20L13.0628 33.0628L10.4058 30.4058L20.8115 20L13.0628 12.2513L2.65705 22.657L0 20Z"
                fill="#D41C1C"
              ></path>
              <path
                d="M13.0628 13.8744L10.4058 16.5314L13.8744 20L6.93718 26.9372L9.59422 29.5942L19.1885 20L13.0628 13.8744Z"
                fill="#D41C1C"
              ></path>
              <path
                d="M6.12564 26.1256L3.46859 23.4686L9.56643 17.3708L12.2235 20.0278L6.12564 26.1256Z"
                fill="#D41C1C"
              ></path>
            </svg>
            <span className="font-medium text-xl">Valid Plug</span>
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
