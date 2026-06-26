import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, subject, message, honeypot } = parsed.data;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const recentCount = await prisma.contactMessage.count({
      where: {
        email,
        createdAt: { gte: new Date(Date.now() - 3600000) },
      },
    });

    if (recentCount >= 3) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, subject, message, spam: false },
    });

    await trackEvent("contact_submit", { email });

    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: process.env.CONTACT_EMAIL,
          subject: subject || `New message from ${name}`,
          html: `<p><strong>${name}</strong> (${email})</p><p>${message}</p>`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
