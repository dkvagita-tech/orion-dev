import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const MODEL = "gemini-2.5-flash";

export async function buildPortfolioContext() {
  const [
    settings,
    projects,
    skills,
    experience,
    certificates,
    testimonials,
    services,
    faqs,
    blogPosts,
    timeline,
    socialLinks,
    resume,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.skill.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.experience.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.certificate.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.service.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.fAQ.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.timeline.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { date: "desc" },
    }),
    prisma.socialLink.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.resume.findFirst(),
  ]);

  return {
    profile: settings,
    projects: projects.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description,
      techStack: p.techStack,
      category: p.category,
      tags: p.tags,
      difficulty: p.difficulty,
      featured: p.featured,
      githubUrl: p.githubUrl,
      demoUrl: p.demoUrl,
    })),
    skills: skills.map((s) => ({
      name: s.name,
      category: s.category,
      level: s.level,
    })),
    experience,
    certificates,
    testimonials,
    services,
    faqs,
    blogPosts: blogPosts.map((b) => ({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      category: b.category,
      tags: b.tags,
    })),
    timeline,
    socialLinks,
    resume,
    currentlyLearning: settings?.currentlyLearning ?? [],
    aiJourney: settings?.aiJourney ?? "",
    available: settings?.available ?? true,
    email: settings?.email ?? "",
    location: settings?.location ?? "",
  };
}

const SYSTEM_PROMPT = `You are Hasnat's AI Portfolio Assistant — intelligent, professional, and helpful like a personal guide (think Jarvis-style clarity, not a generic chatbot).

RULES:
- Answer ONLY using the portfolio context provided below.
- If information is not in the context, say honestly: "I don't have that information in Hasnat's portfolio yet."
- Never invent projects, skills, certificates, or experience.
- Be concise but warm. Use markdown sparingly for lists.
- For project recommendations, reference actual project titles and slugs from context.
- Remember conversation context for follow-up questions.

CAPABILITIES:
- Answer about Hasnat's background, AI journey, skills, projects, certificates, availability, contact info
- Filter and recommend projects by tech (React, Python, AI, etc.), difficulty, or category
- Summarize blog posts and suggest related articles
- Help visitors understand which projects to view first`;

export async function chatWithPortfolioAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = []
) {
  const context = await buildPortfolioContext();

  const contextBlock = JSON.stringify(context, null, 2);

  if (!genAI) {
    return fallbackResponse(message, context);
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: `${SYSTEM_PROMPT}\n\nPORTFOLIO CONTEXT:\n${contextBlock}`,
  });

  const chat = model.startChat({
    history: history.slice(-10).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  });

  const result = await chat.sendMessage(message);
  const response = result.response.text();

  return response || "I'm having trouble responding right now. Please try again.";
}

export async function analyzeJobMatch(jobDescription: string) {
  const context = await buildPortfolioContext();

  if (!genAI) {
    return {
      matchScore: 0,
      strengths: ["AI analysis requires GEMINI_API_KEY to be configured."],
      gaps: [],
      recommendedProjects: context.projects.slice(0, 3).map((p) => p.title),
      summary: "Configure Gemini to enable job matching.",
    };
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: `You are a career matching assistant. Compare the candidate profile against the job description.
Return ONLY valid JSON with this shape:
{
  "matchScore": number (0-100),
  "strengths": string[],
  "gaps": string[],
  "recommendedProjects": string[] (project titles from profile),
  "summary": string
}
Use ONLY the candidate profile data. Do not invent qualifications.`,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(
    `CANDIDATE PROFILE:\n${JSON.stringify(context)}\n\nJOB DESCRIPTION:\n${jobDescription}`
  );
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      matchScore: 0,
      strengths: [],
      gaps: [],
      recommendedProjects: [],
      summary: "Could not parse analysis.",
    };
  }
}

function fallbackResponse(
  message: string,
  context: Awaited<ReturnType<typeof buildPortfolioContext>>
) {
  const q = message.toLowerCase();

  if (q.includes("who is") || q.includes("about hasnat")) {
    return `${context.profile?.siteName || "Hasnat"} is a ${context.profile?.tagline || "developer"}. ${context.profile?.bio || ""}`;
  }
  if (q.includes("project") || q.includes("react") || q.includes("ai")) {
    const filtered = context.projects.filter((p) => {
      if (q.includes("react")) return p.techStack.some((t) => t.toLowerCase().includes("react"));
      if (q.includes("ai")) return p.category === "ai" || p.tags.some((t) => t.toLowerCase().includes("ai"));
      return true;
    });
    if (!filtered.length) return "I don't have matching projects in the portfolio yet.";
    return `Here are relevant projects:\n${filtered.map((p) => `- **${p.title}** (${p.slug}): ${p.description}`).join("\n")}`;
  }
  if (q.includes("skill") || q.includes("technolog")) {
    return `Technologies: ${context.skills.map((s) => s.name).join(", ")}`;
  }
  if (q.includes("contact") || q.includes("email")) {
    return `You can reach Hasnat at ${context.email || "the contact page"}. Location: ${context.location}.`;
  }
  if (q.includes("available") || q.includes("freelance")) {
    return context.available
      ? "Yes! Hasnat is currently available for freelance work."
      : "Hasnat is not actively taking new freelance projects right now.";
  }
  return "I'm running in offline mode. Configure GEMINI_API_KEY for full AI capabilities. Try asking about projects, skills, or contact info.";
}

export async function filterProjectsByQuery(query: string) {
  const context = await buildPortfolioContext();
  const q = query.toLowerCase();

  return context.projects.filter((p) => {
    const haystack = [
      p.title,
      p.description,
      p.category,
      p.difficulty,
      ...p.techStack,
      ...p.tags,
    ]
      .join(" ")
      .toLowerCase();

    if (q.includes("ai")) return p.category === "ai" || haystack.includes("ai");
    if (q.includes("python")) return haystack.includes("python");
    if (q.includes("react")) return haystack.includes("react");
    if (q.includes("beginner")) return p.difficulty === "beginner";
    if (q.includes("full-stack") || q.includes("fullstack"))
      return haystack.includes("node") || haystack.includes("full");
    return haystack.includes(q);
  });
}
