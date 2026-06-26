import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  category: z.string().default("web"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.number().default(0),
});

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  category: z.string().default("general"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  readTime: z.number().default(5),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("frontend"),
  level: z.number().min(0).max(100).default(80),
  icon: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  highlights: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().optional(),
  content: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().default("general"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const timelineSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  type: z.string().default("milestone"),
  icon: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});
