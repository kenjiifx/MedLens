"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Optional PostHog — no-ops when NEXT_PUBLIC_POSTHOG_KEY is unset */
export function PostHogCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inited = useRef(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || inited.current) return;
    inited.current = true;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: false,
    });
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
