"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { DisclaimerBanner } from "@/components/medlens/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UrgencyBadge } from "@/components/medlens/UrgencyBadge";
import { Loader2, Upload } from "lucide-react";

const CHECKLIST = [
  { id: "heavy_bleeding", label: "Heavy or uncontrolled bleeding" },
  { id: "fever", label: "Fever or chills" },
  { id: "spreading_redness", label: "Spreading redness or streaking" },
  { id: "pus", label: "Pus or foul odor" },
  { id: "breathing", label: "Trouble breathing or facial swelling" },
];

function fileToCompressedBase64(file: File, maxEdge = 1280, quality = 0.82): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unsupported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const mimeType = "image/jpeg";
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve({ base64, mimeType });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<{ vision: Record<string, unknown>; merged: Record<string, unknown> } | null>(null);

  function onPick(f: File | null) {
    setResult(null);
    setError(null);
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { base64, mimeType } = await fileToCompressedBase64(file);
      const checklist = CHECKLIST.filter((c) => checks[c.id]).map((c) => c.label);
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType, checklist }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Analysis failed");
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          <span className="text-gradient-display">Visual injury scan</span>
        </h1>
        <p className="text-pretty text-sm text-slate-400 sm:text-base">Choose a photo, mark safety concerns, then analyze.</p>
      </div>
      <DisclaimerBanner />
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Capture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="w-full gap-2 sm:flex-1" onClick={() => inputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Choose photo
              </Button>
              <Button type="button" variant="secondary" disabled={!file || busy} onClick={analyze} className="w-full gap-2 sm:flex-1">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Analyze
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-sm font-medium text-slate-200">Safety checklist</p>
              {CHECKLIST.map((c) => (
                <div key={c.id} className="flex min-h-11 items-center gap-3 rounded-lg py-0.5 sm:min-h-0">
                  <Checkbox
                    id={c.id}
                    checked={Boolean(checks[c.id])}
                    onCheckedChange={(v) => setChecks((s) => ({ ...s, [c.id]: Boolean(v) }))}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={c.id} className="flex-1 cursor-pointer text-sm leading-snug text-slate-300">
                    {c.label}
                  </Label>
                </div>
              ))}
            </div>
            {preview && (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Structured output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {!result && <p className="text-sm text-slate-500">Run an analysis to see merged urgency and JSON.</p>}
            {result && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <UrgencyBadge urgency={result.merged.finalUrgency as "SELF_CARE" | "CLINIC" | "EMERGENCY"} />
                  <span className="text-xs text-slate-500">merge: {String(result.merged.overriddenBy)}</span>
                </div>
                <pre className="max-h-[min(45dvh,360px)] overflow-auto rounded-lg border border-white/10 bg-black/60 p-3 text-[11px] leading-relaxed text-slate-300 sm:max-h-[420px] sm:text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
