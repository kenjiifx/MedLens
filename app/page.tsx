import Link from "next/link";
import { ArrowRight, Brain, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/medlens/DisclaimerBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-200/95 shadow-glow-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            Triage-grade interface
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            <span className="text-gradient-display">Understand symptoms.</span>{" "}
            <span className="text-gradient-accent">Assess urgency.</span>{" "}
            <span className="text-slate-400">Know your next step.</span>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
            Structured AI reasoning, deterministic safety rules, interactive anatomy, and vision triage — in one premium
            clinical shell. Educational only; not a diagnosis.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/symptoms" className="w-full sm:w-auto">
              <Button className="w-full gap-2 sm:w-auto">
                Start symptom triage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/scan" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full gap-2 sm:w-auto">
                Visual injury scan
              </Button>
            </Link>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-600/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(34,211,238,0.12),transparent_50%)]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-200 shadow-inner-soft">
                <Brain className="h-5 w-5" />
              </span>
              Built to impress — and protect
            </CardTitle>
            <CardDescription className="text-slate-400">
              Serious safety story with a cinematic, startup-grade interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-relaxed text-slate-300">
            <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
              <p>
                <span className="font-medium text-white">Rule engine first.</span> Red-flag logic caps outcomes — the model
                cannot downgrade a true emergency pattern.
              </p>
            </div>
            <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
              <p>
                JSON contracts for vision + symptoms, doctor-ready exports, and a UI tuned for{" "}
                <span className="text-slate-200">demo day and real pilots</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      <DisclaimerBanner />
    </div>
  );
}
