"use client";

import { AppProvider } from "@/context/appContext";
import { UseMounted } from "@/lib/mounted";
import { QueryProvider } from "@/provider/queryProvider";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import FaviconSetter from "@/components/FaviconSetter";
import MadeInValidPanelBanner from "@/components/MadeInValidPanelBanner";
import CustomToaster from "@/components/CustomToaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <UseMounted>
          <QueryProvider>
            <AppProvider>
              <ThemeProvider>
                <FaviconSetter />
                <CustomToaster />
                <main>{children}</main>
                <MadeInValidPanelBanner />
              </ThemeProvider>
            </AppProvider>
          </QueryProvider>
        </UseMounted>
      </body>
    </html>
  );
}
