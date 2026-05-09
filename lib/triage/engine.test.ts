import { describe, expect, it } from "vitest";
import { evaluateRules } from "@/lib/triage/engine";
import { mergeAiAndRules } from "@/lib/triage/merge";
import type { AiTriageOutput } from "@/lib/schemas/triage";

describe("evaluateRules", () => {
  it("escalates chest + SOB + dizziness to EMERGENCY", () => {
    const r = evaluateRules({
      bodyRegionIds: ["chest"],
      painDescriptors: ["pressure"],
      associatedSymptoms: ["shortness of breath", "dizziness"],
    });
    expect(r.urgency).toBe("EMERGENCY");
    expect(r.triggeredRuleIds).toContain("chest_sob_dizziness");
  });

  it("returns SELF_CARE for vague mild symptoms", () => {
    const r = evaluateRules({
      bodyRegionIds: ["wrist_l"],
      painDescriptors: ["dull"],
      associatedSymptoms: [],
    });
    expect(r.urgency).toBe("SELF_CARE");
  });

  it("vision visible bone forces EMERGENCY", () => {
    const r = evaluateRules({
      bodyRegionIds: ["hand_l"],
      painDescriptors: [],
      associatedSymptoms: [],
      visionFlags: { visibleBone: true },
    });
    expect(r.urgency).toBe("EMERGENCY");
  });
});

describe("mergeAiAndRules", () => {
  const baseAi: AiTriageOutput = {
    urgency: "SELF_CARE",
    possible_causes: [],
    red_flags: [],
    next_steps: [],
    confidence: 0.5,
    disclaimer: "test",
  };

  it("rules override softer AI", () => {
    const m = mergeAiAndRules(baseAi, {
      urgency: "EMERGENCY",
      triggeredRuleIds: ["chest_sob_dizziness"],
      reasons: ["test"],
    });
    expect(m.finalUrgency).toBe("EMERGENCY");
    expect(m.overriddenBy).toBe("rules");
  });

  it("AI can escalate when rules are self-care", () => {
    const m = mergeAiAndRules(
      { ...baseAi, urgency: "CLINIC" },
      { urgency: "SELF_CARE", triggeredRuleIds: [], reasons: [] },
    );
    expect(m.finalUrgency).toBe("CLINIC");
    expect(m.overriddenBy).toBe("ai");
  });
});
