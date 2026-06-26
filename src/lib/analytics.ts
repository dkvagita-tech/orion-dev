import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function trackEvent(
  type: string,
  metadata?: Record<string, unknown>
) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const path = metadata?.path as string | undefined;

    const device = /mobile/i.test(userAgent) ? "mobile" : "desktop";

    await prisma.analyticsEvent.create({
      data: {
        type,
        path,
        metadata: metadata ?? {},
        device,
        sessionId: metadata?.sessionId as string | undefined,
      },
    });
  } catch {
    // Analytics should never break the app
  }
}

export async function getAnalyticsSummary(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const pageViews = events.filter((e) => e.type === "page_view");
  const uniqueSessions = new Set(pageViews.map((e) => e.sessionId).filter(Boolean));
  const aiChats = events.filter((e) => e.type === "ai_chat");
  const contacts = events.filter((e) => e.type === "contact_submit");

  const projectViews = events.filter((e) => e.type === "project_view");
  const blogViews = events.filter((e) => e.type === "blog_view");

  const deviceCounts = pageViews.reduce(
    (acc, e) => {
      const d = e.device || "unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topProjects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { title: true, slug: true, viewCount: true },
  });

  const topBlogs = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { title: true, slug: true, viewCount: true },
  });

  return {
    totalVisitors: pageViews.length,
    uniqueVisitors: uniqueSessions.size,
    returningVisitors: Math.max(0, pageViews.length - uniqueSessions.size),
    aiChatUsage: aiChats.length,
    contactSubmissions: contacts.length,
    deviceAnalytics: deviceCounts,
    topProjects,
    topBlogs,
  };
}
