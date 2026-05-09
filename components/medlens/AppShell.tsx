"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/medlens/SiteNav";
import { BottomNav } from "@/components/medlens/BottomNav";
import { DisclaimerBanner } from "@/components/medlens/DisclaimerBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#01040c] text-slate-100">
      {/* Deep base */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-slate-950 via-[#020617] to-black" />
      {/* Aurora blobs */}
      <div
        className="pointer-events-none fixed -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-cyan-500/15 blur-[120px] motion-safe:animate-floatY motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-1/4 top-1/4 h-[60vh] w-[60vw] rounded-full bg-blue-600/10 blur-[100px] motion-safe:animate-floatY motion-reduce:animate-none [animation-delay:-3s]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-[40vh] w-[80vw] -translate-x-1/2 rounded-full bg-teal-600/10 blur-[90px]"
        aria-hidden
      />
      {/* Subtle grid */}
      <div className="pointer-events-none fixed inset-0 mesh-grid opacity-[0.35]" aria-hidden />
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteNav pathname={pathname} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:gap-6 sm:py-8 md:pb-8">
          {children}
        </main>
        <footer className="relative z-10 hidden border-t border-white/[0.06] bg-gradient-to-t from-black/60 to-transparent py-8 md:block">
          <div className="mx-auto max-w-6xl px-4">
            <DisclaimerBanner />
            <p className="mt-4 text-center text-xs text-slate-500">MedLens — triage support prototype. Not FDA cleared.</p>
          </div>
        </footer>
        <div className="mx-auto w-full max-w-6xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2 md:hidden">
          <DisclaimerBanner className="text-xs leading-snug" />
          <p className="mt-2 text-center text-[10px] text-slate-600">Not a medical device · Not FDA cleared</p>
        </div>
        <BottomNav pathname={pathname} />
      </div>
    </div>
  );
}
