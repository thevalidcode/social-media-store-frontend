"use client";

import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.title = `Store Error`;
  }, []);

  return <div>{children}</div>;
}
