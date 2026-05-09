"use client";

import Link from "next/link";
import { Activity, Camera, History, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/symptoms", label: "Triage", icon: Activity },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/history", label: "History", icon: History },
] as const;

export function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.1] bg-slate-950/85 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:hidden"
      aria-label="Primary"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
        aria-hidden
      />
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href} className="flex min-w-0 flex-1 justify-center">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all active:scale-[0.96]",
                  active ? "text-cyan-200" : "text-slate-500",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300",
                    active
                      ? "border-cyan-500/40 bg-gradient-to-br from-cyan-500/25 to-teal-600/20 text-cyan-100 shadow-glow-sm"
                      : "border-transparent bg-white/[0.04] text-slate-500",
                  )}
                >
                  <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={active ? 2.25 : 2} aria-hidden />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
