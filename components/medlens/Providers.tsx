"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { PostHogCapture } from "@/components/medlens/PostHogCapture";

export function Providers({ children }: { children: React.ReactNode }) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const tree = (
    <>
      <Suspense fallback={null}>
        <PostHogCapture />
      </Suspense>
      {children}
    </>
  );
  if (!pk) return tree;
  return <ClerkProvider>{tree}</ClerkProvider>;
}
