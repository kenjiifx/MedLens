"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BODY_REGION_IDS, BODY_REGION_META, type BodyLayer, type BodyRegionId, type BodyView } from "@/lib/body/regions";
import { AnatomyViewer } from "@/components/medlens/AnatomyViewer";
import { DisclaimerBanner } from "@/components/medlens/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrgencyBadge } from "@/components/medlens/UrgencyBadge";
import { ASSOCIATED_SYMPTOM_CHIPS, PAIN_DESCRIPTORS } from "@/lib/constants/symptomOptions";
import type { MergeMeta } from "@/lib/triage/merge";
import { Copy, Loader2 } from "lucide-react";

const STEPS = ["Map", "Pain", "Context", "Review"] as const;

export default function SymptomsPage() {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<BodyView>("front");
  const [layer, setLayer] = useState<BodyLayer>("external");
  const [hovered, setHovered] = useState<BodyRegionId | null>(null);
  const [bodyRegionIds, setBodyRegionIds] = useState<BodyRegionId[]>([]);
  const [painDescriptors, setPainDescriptors] = useState<string[]>([]);
  const [painScale, setPainScale] = useState(5);
  const [duration, setDuration] = useState("");
  const [triggers, setTriggers] = useState("");
  const [trend, setTrend] = useState<"improving" | "worsening" | "same" | "unknown">("unknown");
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(MergeMeta & { doctorSummary: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function toggleRegion(id: BodyRegionId) {
    setBodyRegionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function togglePain(p: string) {
    setPainDescriptors((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleAssoc(s: string) {
    setAssociatedSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        bodyRegionIds,
        painDescriptors,
        painScale,
        duration: duration || undefined,
        triggers: triggers || undefined,
        trend,
        associatedSymptoms,
        age: age ? Number(age) : undefined,
      };
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as MergeMeta & { doctorSummary?: string; error?: unknown };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Request failed");
        return;
      }
      setResult({
        finalUrgency: data.finalUrgency,
        overriddenBy: data.overriddenBy,
        ruleResult: data.ruleResult,
        ai: data.ai,
        doctorSummary: data.doctorSummary ?? "",
      });
      setStep(STEPS.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          <span className="text-gradient-display">Symptom triage</span>
        </h1>
        <p className="text-pretty text-sm text-slate-400 sm:text-base">
          Tap the body to map symptoms, then step through the guided flow.
        </p>
        <Progress value={progress} className="h-1.5" />
      </div>
      <DisclaimerBanner />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <CardTitle className="text-sm sm:text-base">Interactive body</CardTitle>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as BodyView)} className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="front">Front</TabsTrigger>
                  <TabsTrigger value="back">Back</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={layer} onValueChange={(v) => setLayer(v as BodyLayer)} className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="external">External</TabsTrigger>
                  <TabsTrigger value="internal">Internal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnatomyViewer
              view={view}
              layer={layer}
              selected={bodyRegionIds}
              hovered={hovered}
              onPick={toggleRegion}
              onHover={setHovered}
            />
            <p className="text-xs text-slate-500">Tap regions to toggle. Selected: {bodyRegionIds.length || "none"}</p>
            <div className="flex flex-wrap gap-2">
              {BODY_REGION_IDS.filter((id) => id === "general").map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={bodyRegionIds.includes(id) ? "default" : "secondary"}
                  onClick={() => toggleRegion(id)}
                >
                  {BODY_REGION_META[id].label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{STEPS[Math.min(step, STEPS.length - 1)]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-slate-400">Pick every area that matches the complaint.</p>
                  <div className="max-h-[min(42dvh,320px)] space-y-0.5 overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-black/30 p-2 text-sm sm:max-h-48">
                    {BODY_REGION_IDS.filter((id) => id !== "general").map((id) => (
                      <label
                        key={id}
                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-1 active:bg-white/10 sm:min-h-0 sm:py-1"
                      >
                        <input
                          type="checkbox"
                          checked={bodyRegionIds.includes(id)}
                          onChange={() => toggleRegion(id)}
                          className="h-5 w-5 shrink-0 accent-cyan-500"
                        />
                        <span className="leading-snug">{BODY_REGION_META[id].label}</span>
                      </label>
                    ))}
                  </div>
                  <Button className="w-full sm:w-auto" onClick={() => setStep(1)} disabled={bodyRegionIds.length === 0}>
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="pain"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Pain quality</Label>
                    <div className="flex flex-wrap gap-2">
                      {PAIN_DESCRIPTORS.map((p) => (
                        <Button
                          key={p}
                          type="button"
                          variant={painDescriptors.includes(p) ? "default" : "secondary"}
                          onClick={() => togglePain(p)}
                          className="min-h-11 shrink-0 px-3 text-xs capitalize sm:text-sm"
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pain scale (0–10)</Label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={painScale}
                      onChange={(e) => setPainScale(Number(e.target.value))}
                      className="h-11 w-full cursor-pointer accent-cyan-500 sm:h-auto"
                    />
                    <p className="text-sm text-cyan-200">{painScale}/10</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setStep(0)}>
                      Back
                    </Button>
                    <Button className="w-full flex-1 sm:w-auto" onClick={() => setStep(2)}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="ctx"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g. 6 hours, 3 days" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="triggers">Triggers / context</Label>
                    <Input id="triggers" placeholder="exertion, food, injury..." value={triggers} onChange={(e) => setTriggers(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Trend</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["improving", "same", "worsening", "unknown"] as const).map((t) => (
                        <Button
                          key={t}
                          type="button"
                          variant={trend === t ? "default" : "secondary"}
                          onClick={() => setTrend(t)}
                          className="min-h-11 flex-1 capitalize sm:flex-initial"
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Associated symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {ASSOCIATED_SYMPTOM_CHIPS.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={associatedSymptoms.includes(s) ? "default" : "secondary"}
                          onClick={() => toggleAssoc(s)}
                          className="min-h-11 max-w-full shrink-0 px-3 text-left text-xs leading-snug sm:text-sm"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input id="age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 34" />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="w-full flex-1 sm:w-auto" onClick={() => setStep(3)}>
                      Review
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && !result && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-3 text-sm text-slate-300"
                >
                  <p>Regions: {bodyRegionIds.map((id) => BODY_REGION_META[id].label).join(", ")}</p>
                  <p>Pain: {painDescriptors.join(", ") || "—"}</p>
                  <p>Associated: {associatedSymptoms.join(", ") || "—"}</p>
                  <Separator />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button className="w-full flex-1 gap-2 sm:w-auto" onClick={submit} disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      Run triage
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <UrgencyBadge urgency={result.finalUrgency} />
                  <span className="text-xs uppercase tracking-wide text-slate-500">Merge: {result.overriddenBy}</span>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-slate-200">
                  <p className="font-medium text-white">Rule engine</p>
                  <p className="text-slate-400">Triggered: {result.ruleResult.triggeredRuleIds.join(", ") || "none"}</p>
                  <ul className="mt-2 list-disc pl-4 text-slate-300">
                    {result.ruleResult.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 text-sm">
                  <p className="font-medium text-cyan-100">AI (educational)</p>
                  <ul className="mt-2 list-disc pl-4 text-slate-200">
                    {result.ai.possible_causes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-slate-400">{result.ai.disclaimer}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2 sm:w-auto"
                    onClick={() => navigator.clipboard.writeText(result.doctorSummary)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy doctor summary
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setResult(null);
                      setStep(0);
                    }}
                  >
                    New session
                  </Button>
                </div>
                <pre className="max-h-[min(50dvh,280px)] overflow-auto rounded-lg border border-white/10 bg-black/60 p-3 text-xs text-slate-300 sm:max-h-48">
                  {result.doctorSummary}
                </pre>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
