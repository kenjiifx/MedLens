import { getOptionalUserId } from "@/lib/auth/optionalUser";
import { NextResponse } from "next/server";
import { listImageAnalyses, listSymptomSessions } from "@/lib/db/symptomSessions";

export const runtime = "nodejs";

export async function GET() {
  const userId = await getOptionalUserId();
  if (!userId) {
    return NextResponse.json({ symptoms: [], images: [] });
  }
  const [symptoms, images] = await Promise.all([listSymptomSessions(userId), listImageAnalyses(userId)]);
  return NextResponse.json({ symptoms, images });
}
