"use client";

import dynamic from "next/dynamic";
import type { BodyLayer, BodyRegionId, BodyView } from "@/lib/body/regions";
import { ANATOMY_CANVAS_HEIGHT_CLASS } from "@/lib/ui/anatomyCanvasHeight";
import { cn } from "@/lib/utils";

const AnatomyCanvas = dynamic(() => import("@/components/medlens/AnatomyCanvas").then((m) => m.AnatomyCanvas), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        ANATOMY_CANVAS_HEIGHT_CLASS,
        "flex w-full items-center justify-center rounded-xl border border-white/10 bg-slate-950",
      )}
    >
      <div className="h-11 w-11 animate-pulse rounded-full bg-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.35)]" />
    </div>
  ),
});

export function AnatomyViewer(props: {
  view: BodyView;
  layer: BodyLayer;
  selected: BodyRegionId[];
  hovered: BodyRegionId | null;
  onPick: (id: BodyRegionId) => void;
  onHover: (id: BodyRegionId | null) => void;
}) {
  return <AnatomyCanvas {...props} />;
}
