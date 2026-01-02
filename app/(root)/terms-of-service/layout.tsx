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

  return <div className="mt-16">{children}</div>;
}
