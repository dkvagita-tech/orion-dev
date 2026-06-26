"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { projectSchema, blogSchema, skillSchema, faqSchema, serviceSchema, testimonialSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/contact");
}

export async function createProject(data: unknown) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  await prisma.project.create({ data: parsed });
  await revalidatePublic();
}

export async function updateProject(id: string, data: unknown) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  await prisma.project.update({ where: { id }, data: parsed });
  await revalidatePublic();
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  await revalidatePublic();
}

export async function createBlogPost(data: unknown) {
  await requireAdmin();
  const parsed = blogSchema.parse(data);
  await prisma.blogPost.create({
    data: {
      ...parsed,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });
  await revalidatePublic();
}

export async function updateBlogPost(id: string, data: unknown) {
  await requireAdmin();
  const parsed = blogSchema.parse(data);
  await prisma.blogPost.update({
    where: { id },
    data: {
      ...parsed,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });
  await revalidatePublic();
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  await revalidatePublic();
}

export async function createSkill(data: unknown) {
  await requireAdmin();
  const parsed = skillSchema.parse(data);
  await prisma.skill.create({ data: parsed });
  await revalidatePublic();
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  await revalidatePublic();
}

export async function createFAQ(data: unknown) {
  await requireAdmin();
  const parsed = faqSchema.parse(data);
  await prisma.fAQ.create({ data: parsed });
  await revalidatePublic();
}

export async function deleteFAQ(id: string) {
  await requireAdmin();
  await prisma.fAQ.delete({ where: { id } });
  await revalidatePublic();
}

export async function createService(data: unknown) {
  await requireAdmin();
  const parsed = serviceSchema.parse(data);
  await prisma.service.create({ data: parsed });
  await revalidatePublic();
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  await revalidatePublic();
}

export async function createTestimonial(data: unknown) {
  await requireAdmin();
  const parsed = testimonialSchema.parse(data);
  await prisma.testimonial.create({ data: parsed });
  await revalidatePublic();
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await revalidatePublic();
}

export async function markMessageRead(id: string) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export async function updateSiteSettings(data: {
  siteName?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  location?: string;
  available?: boolean;
  githubUsername?: string;
  aiJourney?: string;
  currentlyLearning?: string[];
}) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "site" },
    create: { id: "site", ...data, bio: data.bio || "" },
    update: data,
  });
  await revalidatePublic();
}

export async function quickCreateProject(title: string) {
  await requireAdmin();
  const slug = slugify(title);
  return prisma.project.create({
    data: {
      title,
      slug,
      description: "Project description",
      status: "DRAFT",
    },
  });
}
