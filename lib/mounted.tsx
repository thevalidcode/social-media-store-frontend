"use client";

import { useEffect, useState } from "react";
export const UseMounted = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null; // Return mounted state to fix unused variable warning
};
