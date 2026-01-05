"use client";

import { useAppContext } from "@/context/appContext";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { generalSetting } = useAppContext();

  useEffect(() => {
    if (generalSetting) {
      document.title = `Forgot Password | ${generalSetting.storeName}`;
    } else {
      document.title = "Loading…";
    }
  }, [generalSetting]);

  return <div>{children}</div>;
}
