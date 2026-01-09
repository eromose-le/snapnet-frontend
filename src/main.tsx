import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "./App";
import "./styles.css";

// Intentionally basic QueryClient configuration.
// Candidates may improve defaults if they choose.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Intentionally not ideal defaults for a multi-tenant SaaS.
      staleTime: 0,
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
