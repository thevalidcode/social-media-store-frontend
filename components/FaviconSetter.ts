"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/appContext";

export default function FaviconSetter() {
  const { generalSetting } = useAppContext();

  useEffect(() => {
    if (!generalSetting?.faviconUrl) return;

    const link =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
      document.createElement("link");

    link.rel = "icon";
    link.href = generalSetting.faviconUrl;

    document.head.appendChild(link);
  }, [generalSetting?.faviconUrl]);

  return null;
}
