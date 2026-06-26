import { NextRequest, NextResponse } from "next/server";
import { chatWithPortfolioAI } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { message, history, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const reply = await chatWithPortfolioAI(message, history || []);

    if (sessionId) {
      await prisma.chatMessage.createMany({
        data: [
          { sessionId, role: "user", content: message },
          { sessionId, role: "assistant", content: reply },
        ],
      });
    }

    await trackEvent("ai_chat", { sessionId, message: message.slice(0, 100) });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
