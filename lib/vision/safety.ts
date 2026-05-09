import type { VisionSafetyFlags } from "@/lib/triage/types";
import type { VisionAiOutput } from "@/lib/schemas/triage";

export function extractVisionSafetyFromOutput(output: VisionAiOutput): VisionSafetyFlags {
  const blob = [...output.red_flags, output.condition, output.recommendation].join(" ").toLowerCase();
  const flags: VisionSafetyFlags = {};
  if (
    blob.includes("heavy bleeding") ||
    blob.includes("uncontrolled bleeding") ||
    blob.includes("arterial bleeding")
  ) {
    flags.heavyBleeding = true;
  }
  if (blob.includes("black tissue") || blob.includes("necrotic") || blob.includes("necrosis")) {
    flags.blackTissue = true;
  }
  if (blob.includes("visible bone") || blob.includes("bone exposed") || blob.includes("bone visible")) {
    flags.visibleBone = true;
  }
  if (
    blob.includes("severe burn") ||
    blob.includes("full-thickness") ||
    blob.includes("deep burn") ||
    blob.includes("char")
  ) {
    flags.severeBurn = true;
  }
  if (blob.includes("spreading redness") && blob.includes("fever")) {
    flags.spreadingRednessWithFever = true;
  }
  if (blob.includes("pus") || blob.includes("purulent")) {
    flags.pus = true;
  }
  if (
    blob.includes("lip swelling") ||
    blob.includes("tongue swelling") ||
    blob.includes("airway") ||
    blob.includes("throat closing")
  ) {
    flags.facialSwellingAirway = true;
  }
  return flags;
}

export function visionOutputToRedFlagStrings(output: VisionAiOutput): string[] {
  return [...output.red_flags, output.condition, output.recommendation];
}
