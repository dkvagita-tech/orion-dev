import { NextRequest, NextResponse } from "next/server";
import { filterProjectsByQuery } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const projects = await filterProjectsByQuery(query);
    await trackEvent("ai_project_search", { query });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
