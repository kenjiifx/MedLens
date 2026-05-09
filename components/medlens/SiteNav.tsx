"use client";

import Link from "next/link";
import { Activity, Camera, History, LayoutGrid } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/symptoms", label: "Symptoms", icon: Activity },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/history", label: "History", icon: History },
];

export function SiteNav({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-slate-950/75 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/55">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))] sm:gap-4 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="group flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2.5 rounded-xl px-1 font-semibold tracking-tight text-white active:bg-white/5 sm:px-0"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-cyan-500 to-teal-700 text-sm font-bold text-slate-950 shadow-glow-sm ring-1 ring-white/20 transition group-hover:shadow-glow sm:h-9 sm:w-9 sm:text-base">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent" />
            <span className="relative">M</span>
          </span>
          <span className="truncate bg-gradient-to-r from-white to-slate-300 bg-clip-text text-sm font-semibold text-transparent sm:text-base">
            MedLens
          </span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-1.5 md:flex" aria-label="Sections">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-xl px-3.5",
                    active && "border-cyan-500/35 bg-cyan-500/10 text-cyan-100 shadow-[inset_0_0_20px_-8px_rgba(34,211,238,0.25)]",
                  )}
                >
                  <Icon className="h-4 w-4 opacity-90" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <>
              <SignedOut>
                <Link href="/sign-in">
                  <Button size="sm" variant="secondary" className="min-h-11 px-3 md:min-h-10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" className="hidden md:inline-flex">
                  <Button size="sm" variant="ghost">
                    Sign up
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            <span className="hidden text-xs text-slate-500 sm:inline">Auth optional</span>
          )}
        </div>
      </div>
    </header>
  );
}
