import type { RuleEvaluationInput, TriageRule } from "@/lib/triage/types";

function lower(ids: string[]) {
  return ids.map((s) => s.toLowerCase());
}

function hasRegion(input: RuleEvaluationInput, ...regionIds: string[]) {
  const set = new Set(lower(input.bodyRegionIds));
  return regionIds.some((r) => set.has(r.toLowerCase()));
}

function hasChestLike(input: RuleEvaluationInput) {
  return hasRegion(
    input,
    "chest",
    "breast_l",
    "breast_r",
    "ribs_l",
    "ribs_r",
    "heart",
    "lung_l",
    "lung_r",
  );
}

function hasHeadLike(input: RuleEvaluationInput) {
  return hasRegion(input, "scalp", "face", "neck", "thyroid");
}

function hasAbdomenLike(input: RuleEvaluationInput) {
  return hasRegion(
    input,
    "upper_abdomen",
    "lower_abdomen",
    "flank_l",
    "flank_r",
    "groin",
    "liver",
    "stomach",
    "intestines",
  );
}

function assocText(input: RuleEvaluationInput) {
  return input.associatedSymptoms.join(" ").toLowerCase();
}

function painText(input: RuleEvaluationInput) {
  return input.painDescriptors.join(" ").toLowerCase();
}

function assocHas(input: RuleEvaluationInput, ...needles: string[]) {
  const t = assocText(input);
  return needles.some((n) => t.includes(n));
}

function visionFlag(input: RuleEvaluationInput, key: keyof NonNullable<RuleEvaluationInput["visionFlags"]>) {
  return Boolean(input.visionFlags?.[key]);
}

function visionTextHas(input: RuleEvaluationInput, ...needles: string[]) {
  const parts = (input.visionRedFlagsText ?? []).map((s) => s.toLowerCase());
  const blob = parts.join(" ");
  return needles.some((n) => blob.includes(n));
}

/** Ordered: first match wins per rule; engine merges by max urgency */
export const TRIAGE_RULES: TriageRule[] = [
  {
    id: "vision_critical_structure",
    description: "Visible bone, black tissue, or severe burn pattern (safety layer)",
    urgency: "EMERGENCY",
    match: (i) =>
      visionFlag(i, "visibleBone") ||
      visionFlag(i, "blackTissue") ||
      visionFlag(i, "severeBurn") ||
      visionTextHas(i, "visible bone", "black tissue", "necrotic", "char", "deep full-thickness"),
  },
  {
    id: "vision_heavy_bleed",
    description: "Heavy or uncontrolled bleeding indicators",
    urgency: "EMERGENCY",
    match: (i) => visionFlag(i, "heavyBleeding") || visionTextHas(i, "heavy bleeding", "uncontrolled bleeding", "arterial"),
  },
  {
    id: "vision_airway_swelling",
    description: "Facial or airway swelling (possible anaphylaxis)",
    urgency: "EMERGENCY",
    match: (i) => visionFlag(i, "facialSwellingAirway") || visionTextHas(i, "lip swelling", "tongue swelling", "throat closing"),
  },
  {
    id: "chest_sob_dizziness",
    description: "Chest discomfort with shortness of breath and dizziness",
    urgency: "EMERGENCY",
    match: (i) =>
      hasChestLike(i) &&
      assocHas(i, "shortness of breath", "sob", "breathless", "dyspnea", "can't breathe") &&
      assocHas(i, "dizzy", "dizziness", "lightheaded", "syncope", "faint"),
  },
  {
    id: "chest_sob_sweating",
    description: "Chest pressure/pain with shortness of breath and sweating",
    urgency: "EMERGENCY",
    match: (i) =>
      hasChestLike(i) &&
      (painText(i).includes("pressure") || painText(i).includes("crushing") || assocHas(i, "chest pain")) &&
      assocHas(i, "shortness of breath", "sob", "breathless", "dyspnea") &&
      assocHas(i, "sweating", "diaphoresis", "clammy"),
  },
  {
    id: "stroke_like",
    description: "Sudden focal weakness, speech or face changes",
    urgency: "EMERGENCY",
    match: (i) =>
      assocHas(i, "sudden weakness", "one-sided weakness", "facial droop", "slurred speech", "aphasia", "vision loss sudden"),
  },
  {
    id: "head_injury_red_flags",
    description: "Head injury context with vomiting or confusion",
    urgency: "EMERGENCY",
    match: (i) =>
      hasHeadLike(i) &&
      assocHas(i, "head injury", "trauma", "hit head", "fall") &&
      (assocHas(i, "vomit", "nausea severe") || assocHas(i, "confusion", "altered mental", "drowsy")),
  },
  {
    id: "severe_abdominal_rigid_fever",
    description: "Severe abdominal pain with rigid abdomen or high fever",
    urgency: "EMERGENCY",
    match: (i) =>
      hasAbdomenLike(i) &&
      (i.painScale ?? 0) >= 8 &&
      (assocHas(i, "rigid abdomen", "board-like", "rebound") || assocHas(i, "high fever", "fever 39", "fever 40", "rigors")),
  },
  {
    id: "pregnancy_abdominal_pain_bleeding",
    description: "Possible pregnancy with abdominal pain and bleeding",
    urgency: "EMERGENCY",
    match: (i) =>
      hasAbdomenLike(i) &&
      assocHas(i, "pregnant", "pregnancy") &&
      assocHas(i, "bleeding", "vaginal bleeding", "shoulder tip pain"),
  },
  {
    id: "infection_sepsis_like",
    description: "Fever with confusion or very rapid breathing",
    urgency: "EMERGENCY",
    match: (i) =>
      assocHas(i, "fever") &&
      (assocHas(i, "confusion", "altered mental", "lethargy") || assocHas(i, "very fast breathing", "tachypnea")),
  },
  {
    id: "infection_spreading_redness_pus_fever",
    description: "Spreading skin infection signs with fever or pus",
    urgency: "CLINIC",
    match: (i) =>
      (visionFlag(i, "spreadingRednessWithFever") || visionFlag(i, "pus")) &&
      (assocHas(i, "fever") || visionTextHas(i, "pus", "spreading redness")),
  },
  {
    id: "chest_pain_isolated",
    description: "Chest symptoms without full emergency pattern",
    urgency: "CLINIC",
    match: (i) => hasChestLike(i) && (painText(i).includes("sharp") || painText(i).includes("pressure") || assocHas(i, "chest")),
  },
  {
    id: "severe_pain_default_clinic",
    description: "Severe pain (8+) lasting or worsening",
    urgency: "CLINIC",
    match: (i) => (i.painScale ?? 0) >= 8 && i.trend === "worsening",
  },
];
