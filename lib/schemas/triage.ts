import { z } from "zod";

export const urgencySchema = z.enum(["SELF_CARE", "CLINIC", "EMERGENCY"]);
export type Urgency = z.infer<typeof urgencySchema>;

export const symptomSessionSchema = z.object({
  bodyRegionIds: z.array(z.string()).min(1),
  painDescriptors: z.array(z.string()).default([]),
  painScale: z.number().min(0).max(10).optional(),
  duration: z.string().optional(),
  triggers: z.string().optional(),
  trend: z.enum(["improving", "worsening", "same", "unknown"]).optional(),
  associatedSymptoms: z.array(z.string()).default([]),
  age: z.number().min(0).max(120).optional(),
});

export type SymptomSessionInput = z.infer<typeof symptomSessionSchema>;

export const aiTriageOutputSchema = z.object({
  urgency: urgencySchema,
  possible_causes: z.array(z.string()),
  red_flags: z.array(z.string()),
  next_steps: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  disclaimer: z.string(),
});

export type AiTriageOutput = z.infer<typeof aiTriageOutputSchema>;

export const visionAiOutputSchema = z.object({
  condition: z.string(),
  severity: z.string(),
  confidence: z.number().min(0).max(1),
  red_flags: z.array(z.string()),
  recommendation: z.string(),
  urgency: urgencySchema,
});

export type VisionAiOutput = z.infer<typeof visionAiOutputSchema>;

export const mergedTriageResponseSchema = z.object({
  finalUrgency: urgencySchema,
  overriddenBy: z.enum(["rules", "ai", "both"]),
  ruleResult: z.object({
    urgency: urgencySchema,
    triggeredRuleIds: z.array(z.string()),
    reasons: z.array(z.string()),
  }),
  ai: aiTriageOutputSchema,
});

export type MergedTriageResponse = z.infer<typeof mergedTriageResponseSchema>;
