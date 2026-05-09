import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiTriageOutput, VisionAiOutput } from "@/lib/schemas/triage";
import { aiTriageOutputSchema, visionAiOutputSchema } from "@/lib/schemas/triage";
import { extractJsonObject } from "@/lib/ai/parse";

const SYMPTOM_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const VISION_MODEL = process.env.GEMINI_VISION_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function generateSymptomTriageJson(prompt: string): Promise<AiTriageOutput> {
  const client = getClient();
  if (!client) {
    return {
      urgency: "SELF_CARE",
      possible_causes: ["Insufficient data (no AI key configured)"],
      red_flags: [],
      next_steps: ["Configure GEMINI_API_KEY for AI-assisted triage."],
      confidence: 0,
      disclaimer: "MedLens is not a medical device. This is a development fallback response.",
    };
  }
  const model = client.getGenerativeModel({
    model: SYMPTOM_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  const parsed = extractJsonObject(text);
  return aiTriageOutputSchema.parse(parsed);
}

export async function generateVisionJson(prompt: string, imageParts: { mimeType: string; data: Buffer }[]) {
  const client = getClient();
  if (!client) {
    return {
      condition: "Unable to analyze (no AI key)",
      severity: "Unknown",
      confidence: 0,
      red_flags: [],
      recommendation: "Configure GEMINI_API_KEY to enable vision triage.",
      urgency: "CLINIC" as const,
    } satisfies VisionAiOutput;
  }
  const model = client.getGenerativeModel({
    model: VISION_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [{ text: prompt }];
  for (const img of imageParts) {
    parts.push({
      inlineData: { mimeType: img.mimeType, data: img.data.toString("base64") },
    });
  }
  const res = await model.generateContent(parts);
  const text = res.response.text();
  const parsed = extractJsonObject(text);
  return visionAiOutputSchema.parse(parsed);
}
