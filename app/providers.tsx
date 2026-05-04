"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      if (typeof window !== "undefined") {
        console.warn(
          "NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` to provision a deployment.",
        );
      }
      return null;
    }
    return new ConvexReactClient(url);
  }, []);

  if (!client) {
    return <ConfigMissing>{children}</ConfigMissing>;
  }
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

function ConfigMissing({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[100] bg-haiti-red/95 text-white text-sm px-4 py-2 text-center">
        Convex is not configured. Run{" "}
        <code className="bg-black/30 px-1.5 py-0.5 rounded">npx convex dev</code>{" "}
        in the project directory.
      </div>
      <div className="pt-8">{children}</div>
    </>
  );
}
