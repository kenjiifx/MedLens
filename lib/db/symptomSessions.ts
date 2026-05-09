import type { MergeMeta } from "@/lib/triage/merge";
import type { SymptomSessionInput } from "@/lib/schemas/triage";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveSymptomSession(
  userId: string | null,
  input: SymptomSessionInput,
  merged: MergeMeta,
) {
  const supabase = createAdminClient();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("symptom_sessions")
    .insert({
      user_id: userId,
      body_region: input.bodyRegionIds[0] ?? null,
      symptom_data: input as unknown as Record<string, unknown>,
      ai_output: merged.ai as unknown as Record<string, unknown>,
      rule_output: merged.ruleResult as unknown as Record<string, unknown>,
      urgency: merged.finalUrgency,
    })
    .select("id")
    .single();
  if (error) {
    console.error("saveSymptomSession", error);
    return null;
  }
  return data?.id ?? null;
}

export async function listSymptomSessions(userId: string) {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("symptom_sessions")
    .select("id, body_region, symptom_data, urgency, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("listSymptomSessions", error);
    return [];
  }
  return data ?? [];
}

export async function saveImageAnalysis(
  userId: string | null,
  payload: { image_url: string | null; ai_result: unknown; severity: string | null },
) {
  const supabase = createAdminClient();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("image_analyses")
    .insert({
      user_id: userId,
      image_url: payload.image_url,
      ai_result: payload.ai_result as Record<string, unknown>,
      severity: payload.severity,
    })
    .select("id")
    .single();
  if (error) {
    console.error("saveImageAnalysis", error);
    return null;
  }
  return data?.id ?? null;
}

export async function listImageAnalyses(userId: string) {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("image_analyses")
    .select("id, image_url, ai_result, severity, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("listImageAnalyses", error);
    return [];
  }
  return data ?? [];
}
