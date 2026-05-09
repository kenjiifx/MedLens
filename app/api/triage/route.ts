import { NextResponse } from "next/server";
import { getOptionalUserId } from "@/lib/auth/optionalUser";
import { symptomSessionSchema } from "@/lib/schemas/triage";
import { buildSymptomPrompt } from "@/lib/ai/prompts";
import { generateSymptomTriageJson } from "@/lib/ai/gemini";
import { evaluateRules } from "@/lib/triage/engine";
import type { RuleEvaluationInput } from "@/lib/triage/types";
import { mergeAiAndRules } from "@/lib/triage/merge";
import { formatDoctorSummary } from "@/lib/export/doctorSummary";
import { saveSymptomSession } from "@/lib/db/symptomSessions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const json = (await req.json()) as unknown;
  const parsed = symptomSessionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;
  const ruleInput: RuleEvaluationInput = { ...input };
  const ruleResult = evaluateRules(ruleInput);
  const ai = await generateSymptomTriageJson(buildSymptomPrompt(input));
  const merged = mergeAiAndRules(ai, ruleResult);
  const doctorSummary = formatDoctorSummary(input, merged);

  const userId = await getOptionalUserId();
  const sessionId = await saveSymptomSession(userId, input, merged);

  return NextResponse.json({
    ...merged,
    doctorSummary,
    sessionId,
  });
}
