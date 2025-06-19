import { ThemeProvider } from "./providers/theme-provider";
import { UseMounted } from "@/lib/mounted";
import { QueryProvider } from "@/provider/queryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/appContext";

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
        {/* toaster for notifications */}
        <Toaster />
        {/* to check if the user is mounted */}
        <UseMounted>
          {/* app provider to provide the api url to the app */}
          <AppProvider>
            {/* theme provider to provide the theme to the app */}
            <ThemeProvider>
              {/* query provider to provide the query client to the app */}
              <QueryProvider>
                {/* main to render the children */}
                <main>{children}</main>
              </QueryProvider>
              {/* theme provider to provide the theme to the app */}
            </ThemeProvider>
          </AppProvider>
        </UseMounted>
      </body>
    </html>
  );
}
