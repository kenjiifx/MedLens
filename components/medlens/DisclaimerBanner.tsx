"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/50 via-amber-950/35 to-slate-950/40 px-3 py-3 text-sm text-amber-100/95 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.12)] backdrop-blur-md sm:px-4 sm:py-3.5",
        "before:pointer-events-none before:absolute before:-right-8 before:-top-8 before:h-24 before:w-24 before:rounded-full before:bg-amber-400/10 before:blur-2xl",
        className,
      )}
    >
      <div className="relative flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/15 text-amber-300 shadow-inner-soft">
          <AlertTriangle className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
        </div>
        <p className="min-w-0 leading-relaxed text-amber-50/95">
          MedLens is not a medical device. This application does not diagnose conditions. Always seek professional medical
          advice for serious concerns. If you may be experiencing a medical emergency, call emergency services immediately.
        </p>
      </div>
    </div>
  );
}
