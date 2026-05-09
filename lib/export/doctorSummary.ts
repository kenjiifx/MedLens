import type { SymptomSessionInput } from "@/lib/schemas/triage";
import type { MergeMeta } from "@/lib/triage/merge";

export function formatDoctorSummary(input: SymptomSessionInput, merged: MergeMeta): string {
  const lines: string[] = [];
  lines.push("MedLens — patient-reported summary (not a diagnosis)");
  lines.push("");
  lines.push("Patient reports:");
  lines.push(`- Body regions: ${input.bodyRegionIds.join(", ")}`);
  if (input.painDescriptors.length) lines.push(`- Pain quality: ${input.painDescriptors.join(", ")}`);
  if (input.painScale != null) lines.push(`- Pain level: ${input.painScale}/10`);
  if (input.duration) lines.push(`- Duration: ${input.duration}`);
  if (input.triggers) lines.push(`- Triggers / context: ${input.triggers}`);
  if (input.trend) lines.push(`- Trend: ${input.trend}`);
  if (input.associatedSymptoms.length) lines.push(`- Associated symptoms: ${input.associatedSymptoms.join(", ")}`);
  if (input.age != null) lines.push(`- Age (if provided): ${input.age}`);
  lines.push("");
  lines.push(`Rule-based triage urgency: ${merged.ruleResult.urgency}`);
  if (merged.ruleResult.triggeredRuleIds.length) {
    lines.push(`Triggered rules: ${merged.ruleResult.triggeredRuleIds.join(", ")}`);
  }
  lines.push(`AI model urgency (before merge): ${merged.ai.urgency}`);
  lines.push(`Final urgency (rules cannot be downgraded): ${merged.finalUrgency}`);
  lines.push(`Merge note: ${merged.overriddenBy === "rules" ? "Rules escalated relative to AI." : merged.overriddenBy === "ai" ? "AI suggested higher urgency than rules." : "Rules and AI aligned on urgency band."}`);
  lines.push("");
  lines.push("Possible causes (AI, educational):");
  merged.ai.possible_causes.forEach((c) => lines.push(`- ${c}`));
  lines.push("");
  lines.push("Red flags called out:");
  const flags = [...new Set([...merged.ai.red_flags, ...merged.ruleResult.reasons])];
  flags.forEach((f) => lines.push(`- ${f}`));
  lines.push("");
  lines.push("Suggested next steps (educational):");
  merged.ai.next_steps.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push(merged.ai.disclaimer);
  lines.push("");
  lines.push("MedLens is not a medical device. Always seek professional medical advice for serious concerns.");
  return lines.join("\n");
}
