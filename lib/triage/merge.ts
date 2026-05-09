import type { AiTriageOutput, Urgency } from "@/lib/schemas/triage";
import type { RuleEvaluationResult } from "@/lib/triage/types";
import { URGENCY_RANK, maxUrgency } from "@/lib/triage/engine";

export type MergeMeta = {
  finalUrgency: Urgency;
  overriddenBy: "rules" | "ai" | "both";
  ruleResult: RuleEvaluationResult;
  ai: AiTriageOutput;
};

export function mergeAiAndRules(ai: AiTriageOutput, ruleResult: RuleEvaluationResult): MergeMeta {
  const finalUrgency = maxUrgency(ai.urgency, ruleResult.urgency);
  const aiRank = URGENCY_RANK[ai.urgency];
  const ruleRank = URGENCY_RANK[ruleResult.urgency];
  let overriddenBy: MergeMeta["overriddenBy"];
  if (ruleRank > aiRank) overriddenBy = "rules";
  else if (aiRank > ruleRank) overriddenBy = "ai";
  else overriddenBy = "both";
  return { finalUrgency, overriddenBy, ruleResult, ai };
}
