import type { Urgency } from "@/lib/schemas/triage";
import { Badge } from "@/components/ui/badge";

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  if (urgency === "EMERGENCY") return <Badge variant="emergency">Emergency</Badge>;
  if (urgency === "CLINIC") return <Badge variant="clinic">Clinic recommended</Badge>;
  return <Badge variant="muted">Self-care / monitor</Badge>;
}
