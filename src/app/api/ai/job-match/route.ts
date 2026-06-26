import { NextRequest, NextResponse } from "next/server";
import { analyzeJobMatch } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, sessionId } = await req.json();

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "Job description required" }, { status: 400 });
    }

    const result = await analyzeJobMatch(jobDescription);
    await trackEvent("ai_job_match", { sessionId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job match error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
