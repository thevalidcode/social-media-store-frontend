"use client";

import { useAppContext } from "@/context/appContext";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { generalSetting } = useAppContext();

  useEffect(() => {
    if (generalSetting) {
      document.title = `Terms Of Service | ${generalSetting.storeName}`;
    } else {
      document.title = "Loading…";
    }
  }, [generalSetting]);

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 mt-16">
      {children}
    </div>
  );
}
