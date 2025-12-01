import { AppProvider } from "@/context/appContext";
import { UseMounted } from "@/lib/mounted";
import { QueryProvider } from "@/provider/queryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import FaviconSetter from "@/components/FaviconSetter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UseMounted>
          <QueryProvider>
            <AppProvider>
              <ThemeProvider>
                <FaviconSetter />
                <Toaster position="top-right" richColors />
                <main>{children}</main>
              </ThemeProvider>
            </AppProvider>
          </QueryProvider>
        </UseMounted>
      </body>
    </html>
  );
}
