import { ThemeProvider } from "./providers/theme-provider";
import { UseMounted } from "@/lib/mounted";
import { QueryProvider } from "@/provider/queryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "valid panel",
  description: "social media panel",
};

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
        <Toaster />
        <UseMounted>
          <ThemeProvider>
            <QueryProvider>
              <main>{children}</main>
            </QueryProvider>
          </ThemeProvider>
        </UseMounted>
      </body>
    </html>
  );
}
