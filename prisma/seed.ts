import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeMe123!", 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@hasnat.dev" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@hasnat.dev",
      name: "M Hasnat Khan",
      passwordHash,
      role: "admin",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      siteName: "M Hasnat Khan",
      tagline: "Frontend Developer & AI Enthusiast",
      bio: "Crafting clean, responsive, and user-centered digital experiences with modern web technologies. Passionate about AI-powered tools and intelligent interfaces.",
      email: "dk.vagita@gmail.com",
      location: "Pakistan",
      available: true,
      githubUsername: "mhasnatkhan",
      aiJourney: "Started exploring AI in 2023 through chatbots and automation. Now building AI-integrated portfolio tools, RAG assistants, and intelligent UX patterns using OpenAI and modern web stacks.",
      currentlyLearning: ["Next.js App Router", "RAG Systems", "TypeScript", "Prisma", "AI Agents"],
    },
  });

  const existingResume = await prisma.resume.findFirst();
  if (!existingResume) {
    await prisma.resume.create({
      data: {
        summary:
          "Passionate frontend developer with experience building responsive, accessible web applications. Skilled in HTML, CSS, JavaScript, React, and AI integration.",
      },
    });
  }

  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "A fully responsive online store with product listings, cart, and checkout flow.",
      techStack: ["React", "CSS", "Node.js"],
      category: "web",
      tags: ["fullstack", "ecommerce"],
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    },
    {
      title: "AI Chat Assistant",
      slug: "ai-chat-assistant",
      description: "An intelligent chatbot built with natural language processing capabilities.",
      techStack: ["JavaScript", "OpenAI", "CSS"],
      category: "ai",
      tags: ["ai", "nlp", "chatbot"],
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    },
    {
      title: "Weather Dashboard",
      slug: "weather-dashboard",
      description: "Real-time weather tracking app with forecast data and location search.",
      techStack: ["React", "API", "CSS Grid"],
      category: "web",
      tags: ["api", "dashboard"],
      imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80",
    },
    {
      title: "Task Manager",
      slug: "task-manager",
      description: "A Kanban-style productivity app for managing tasks and deadlines efficiently.",
      techStack: ["HTML", "CSS", "JavaScript"],
      category: "web",
      tags: ["productivity"],
      difficulty: "beginner",
      imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
    },
  ];

  for (const [i, project] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { ...project, status: "PUBLISHED", order: i },
      create: { ...project, status: "PUBLISHED", order: i, difficulty: project.difficulty || "intermediate" },
    });
  }

  const skills = [
    { name: "HTML", category: "frontend", level: 95 },
    { name: "CSS", category: "frontend", level: 90 },
    { name: "JavaScript", category: "frontend", level: 80 },
    { name: "React", category: "frontend", level: 75 },
    { name: "TypeScript", category: "frontend", level: 70 },
    { name: "Next.js", category: "frontend", level: 75 },
    { name: "UI/UX Design", category: "design", level: 85 },
    { name: "Git", category: "tools", level: 85 },
  ];

  for (const [i, skill] of skills.entries()) {
    await prisma.skill.create({ data: { ...skill, order: i, status: "PUBLISHED" } }).catch(() => {});
  }

  const services = [
    { title: "Web Development", description: "Responsive, fast, and accessible websites built with modern technologies.", icon: "code" },
    { title: "UI/UX Design", description: "Clean, user-centered interfaces designed for optimal usability.", icon: "paintbrush" },
    { title: "AI & Automation", description: "Smart automation solutions and AI-powered tools.", icon: "brain" },
    { title: "Freelancing", description: "Reliable freelance development tailored to your needs.", icon: "handshake" },
  ];

  for (const [i, service] of services.entries()) {
    await prisma.service.create({ data: { ...service, order: i, status: "PUBLISHED" } }).catch(() => {});
  }

  const testimonials = [
    { name: "Ahmed Khan", role: "Startup Founder", content: "Hasnat delivered a stunning portfolio site that exceeded our expectations.", rating: 5 },
    { name: "Sara Rahman", role: "Product Manager", content: "Great communication and clean code. The React dashboard loads incredibly fast.", rating: 5 },
  ];

  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({ data: { ...t, order: i, status: "PUBLISHED" } }).catch(() => {});
  }

  const faqs = [
    { question: "What services do you offer?", answer: "Web development, UI/UX design, AI automation, and freelance development.", category: "general" },
    { question: "Are you available for freelance work?", answer: "Yes! I'm currently available for remote freelance projects worldwide.", category: "general" },
    { question: "How long does a project take?", answer: "Landing pages: 1-2 weeks. Full apps: 4-8 weeks depending on scope.", category: "pricing" },
  ];

  for (const [i, faq] of faqs.entries()) {
    await prisma.fAQ.create({ data: { ...faq, order: i, status: "PUBLISHED" } }).catch(() => {});
  }

  await prisma.blogPost.upsert({
    where: { slug: "building-ai-portfolio-assistant" },
    update: {},
    create: {
      title: "Building an AI Portfolio Assistant",
      slug: "building-ai-portfolio-assistant",
      excerpt: "How I built a Jarvis-style AI assistant that reads from my database in real-time.",
      content: "This post covers RAG patterns, Next.js API routes, and OpenAI integration for portfolio sites...",
      category: "AI",
      tags: ["ai", "nextjs", "openai"],
      status: "PUBLISHED",
      readTime: 6,
      publishedAt: new Date(),
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
