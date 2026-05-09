import type { Urgency } from "@/lib/schemas/triage";
import { TRIAGE_RULES } from "@/lib/triage/rules";
import type { RuleEvaluationInput, RuleEvaluationResult } from "@/lib/triage/types";

const URGENCY_RANK: Record<Urgency, number> = {
  SELF_CARE: 0,
  CLINIC: 1,
  EMERGENCY: 2,
};

function maxUrgency(a: Urgency, b: Urgency): Urgency {
  return URGENCY_RANK[a] >= URGENCY_RANK[b] ? a : b;
}

export function evaluateRules(input: RuleEvaluationInput): RuleEvaluationResult {
  const matched = TRIAGE_RULES.filter((r) => r.match(input));
  if (matched.length === 0) {
    return { urgency: "SELF_CARE", triggeredRuleIds: [], reasons: [] };
  }
  let urgency: Urgency = "SELF_CARE";
  for (const r of matched) {
    urgency = maxUrgency(urgency, r.urgency);
  }
  return {
    urgency,
    triggeredRuleIds: matched.map((r) => r.id),
    reasons: matched.map((r) => `${r.description} [${r.urgency}]`),
  };
}

export { URGENCY_RANK, maxUrgency };
