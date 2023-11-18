"use client";

import { MapProviderMock } from "@/hooks/MapProvider/MapProvider.mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const ClientProviderMock=({ children }: React.PropsWithChildren)=>{
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
      <MapProviderMock>
        {children}
      </MapProviderMock>
    </QueryClientProvider>
  );
}