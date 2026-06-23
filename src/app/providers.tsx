"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Analytics from "@/components/layout/Analytics";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--dark)",
            color: "var(--bg)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "var(--bg)",
              secondary: "#16a34a",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--bg)",
              secondary: "var(--accent)",
            },
          },
        }}
      />
      <Analytics />
    </SessionProvider>
  );
}
