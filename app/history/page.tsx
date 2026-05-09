"use client";

import { useEffect, useState } from "react";
import { DisclaimerBanner } from "@/components/medlens/DisclaimerBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UrgencyBadge } from "@/components/medlens/UrgencyBadge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SymptomRow = {
  id: string;
  body_region: string | null;
  urgency: string;
  created_at: string;
};

type ImageRow = {
  id: string;
  severity: string | null;
  created_at: string;
};

export default function HistoryPage() {
  const [symptoms, setSymptoms] = useState<SymptomRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (!cancelled) {
          setSymptoms(data.symptoms ?? []);
          setImages(data.images ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            <span className="text-gradient-display">History</span>
          </h1>
          <p className="text-pretty text-sm text-slate-400 sm:text-base">
            Sessions saved when you are signed in and Supabase is configured.
          </p>
        </div>
        <Link href="/symptoms" className="w-full shrink-0 sm:w-auto">
          <Button className="w-full sm:w-auto">New triage</Button>
        </Link>
      </div>
      <DisclaimerBanner />
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Symptom sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {!loading && symptoms.length === 0 && <p className="text-sm text-slate-500">No saved sessions yet.</p>}
            <ul className="space-y-3">
              {symptoms.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-4 shadow-inner backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{s.body_region ?? "Multiple regions"}</p>
                    <UrgencyBadge urgency={s.urgency as "SELF_CARE" | "CLINIC" | "EMERGENCY"} />
                  </div>
                  <p className="text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Image analyses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!loading && images.length === 0 && <p className="text-sm text-slate-500">No saved scans yet.</p>}
            <ul className="space-y-3">
              {images.map((i) => (
                <li
                  key={i.id}
                  className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-4 shadow-inner backdrop-blur-sm"
                >
                  <p className="text-sm text-white">Scan</p>
                  <p className="text-xs text-slate-400">Severity: {i.severity ?? "—"}</p>
                  <p className="text-xs text-slate-500">{new Date(i.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <p className="text-center text-xs text-slate-500">Timeline is read-only in MVP — export summaries from the symptom flow.</p>
    </div>
  );
}
