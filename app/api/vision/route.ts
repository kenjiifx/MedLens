import { getOptionalUserId } from "@/lib/auth/optionalUser";
import { NextResponse } from "next/server";
import { z } from "zod";
import { VISION_SYSTEM } from "@/lib/ai/prompts";
import { generateVisionJson } from "@/lib/ai/gemini";
import { evaluateRules } from "@/lib/triage/engine";
import type { RuleEvaluationInput } from "@/lib/triage/types";
import { mergeAiAndRules } from "@/lib/triage/merge";
import { aiTriageOutputSchema } from "@/lib/schemas/triage";
import { extractVisionSafetyFromOutput, visionOutputToRedFlagStrings } from "@/lib/vision/safety";
import { saveImageAnalysis } from "@/lib/db/symptomSessions";

export const runtime = "nodejs";

const bodySchema = z.object({
  imageBase64: z.string().min(10),
  mimeType: z.string().default("image/jpeg"),
  checklist: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const json = (await req.json()) as unknown;
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { imageBase64, mimeType, checklist } = parsed.data;
  let buffer: Buffer;
  try {
    buffer = Buffer.from(imageBase64, "base64");
  } catch {
    return NextResponse.json({ error: "Invalid base64 image" }, { status: 400 });
  }
  if (buffer.byteLength > 4_500_000) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  const vision = await generateVisionJson(VISION_SYSTEM, [{ mimeType, data: buffer }]);
  const visionFlagsFromModel = extractVisionSafetyFromOutput(vision);
  const items = checklist ?? [];
  const blob = items.join(" ").toLowerCase();
  const checklistFlags: RuleEvaluationInput["visionFlags"] = {};
  if (blob.includes("heavy") || blob.includes("uncontrolled bleeding")) checklistFlags.heavyBleeding = true;
  if (blob.includes("pus")) checklistFlags.pus = true;
  if (blob.includes("breathing") || blob.includes("facial swelling")) checklistFlags.facialSwellingAirway = true;
  const hasFever = items.some((x) => x.toLowerCase().includes("fever"));
  const hasSpreading = items.some((x) => x.toLowerCase().includes("spreading"));
  if (hasFever && hasSpreading) checklistFlags.spreadingRednessWithFever = true;
  const visionFlags = { ...visionFlagsFromModel, ...checklistFlags };
  const ruleInput: RuleEvaluationInput = {
    bodyRegionIds: ["general"],
    painDescriptors: [],
    associatedSymptoms: checklist ?? [],
    visionFlags,
    visionRedFlagsText: visionOutputToRedFlagStrings(vision),
  };
  const ruleResult = evaluateRules(ruleInput);

  const aiForMerge = aiTriageOutputSchema.parse({
    urgency: vision.urgency,
    possible_causes: [vision.condition],
    red_flags: vision.red_flags,
    next_steps: [vision.recommendation],
    confidence: vision.confidence,
    disclaimer:
      "MedLens is not a medical device. This does not diagnose conditions. Seek professional care when appropriate.",
  });
  const merged = mergeAiAndRules(aiForMerge, ruleResult);

  const userId = await getOptionalUserId();
  await saveImageAnalysis(userId, {
    image_url: null,
    ai_result: { vision, merged },
    severity: vision.severity,
  });

  return NextResponse.json({ vision, merged });
}
