"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TeleSpeechProvider } from "@/contexts/TeleSpeechContext";
import { McpCacheProvider } from "@/contexts/McpCacheContext";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <McpCacheProvider>
        <TeleSpeechProvider>{children}</TeleSpeechProvider>
      </McpCacheProvider>
    </QueryClientProvider>
  );
}
