"use client";

import Nav from "@/components/nav";
import Wrapper from "@/components/wrapper";
import { useAppContext } from "@/context/appContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { apiUrl, panel_id, setPanelId, domain } = useAppContext();
  const { error, isLoading } = useQuery({
    queryKey: ["panel_id", window.location.hostname],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/panel/panel_id?domain=${domain}`);
      if (!res.data || !res.data.panel_id) {
        throw new Error("No panel_id found for this domain");
      }
      const panelId = res.data.panel_id;
      localStorage.setItem("panel_id", panelId);
      setPanelId(panelId);
      return panelId;
    },

    enabled: typeof window !== "undefined" && !panel_id,
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Wrapper>
      <Nav />
      {children}
    </Wrapper>
  );
}
