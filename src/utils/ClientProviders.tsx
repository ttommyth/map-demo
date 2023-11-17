"use client";

import { MapProvider } from "@/hooks/MapProvider";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnReconnect:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false
      },
    },
  }));

  return (
    <QueryClientProvider client={client}>
      <MapProvider>
        {children}
      </MapProvider>
    </QueryClientProvider>
  );
}

export default Providers;