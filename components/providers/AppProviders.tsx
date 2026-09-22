"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

import { PWAProvider } from "@/components/pwa/PWAProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PWAProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </PWAProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(255, 251, 246, 0.94)",
            border: "1px solid rgba(63, 52, 44, 0.14)",
            color: "#1c1612",
            fontFamily: "Chillax, sans-serif",
            backdropFilter: "blur(16px)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
