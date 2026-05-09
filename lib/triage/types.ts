import type { SymptomSessionInput, Urgency } from "@/lib/schemas/triage";

export type VisionSafetyFlags = {
  heavyBleeding?: boolean;
  blackTissue?: boolean;
  visibleBone?: boolean;
  severeBurn?: boolean;
  spreadingRednessWithFever?: boolean;
  pus?: boolean;
  facialSwellingAirway?: boolean;
};

export type RuleEvaluationInput = SymptomSessionInput & {
  visionFlags?: VisionSafetyFlags;
  visionRedFlagsText?: string[];
};

export type RuleEvaluationResult = {
  urgency: Urgency;
  triggeredRuleIds: string[];
  reasons: string[];
};

export type TriageRule = {
  id: string;
  description: string;
  urgency: Urgency;
  match: (input: RuleEvaluationInput) => boolean;
};
