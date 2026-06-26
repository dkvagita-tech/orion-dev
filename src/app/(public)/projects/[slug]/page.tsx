import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  return { title: project?.title || "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug, status: "PUBLISHED" } });

  if (!project) notFound();

  await prisma.project.update({ where: { id: project.id }, data: { viewCount: { increment: 1 } } });
  await trackEvent("project_view", { path: `/projects/${slug}`, slug });

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.title} className="mb-8 aspect-video w-full rounded-2xl object-cover" />
      )}
      <h1 className="font-display text-4xl font-bold">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span key={tech} className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300">{tech}</span>
        ))}
      </div>
      {project.content && (
        <article className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap">{project.content}</article>
      )}
      <div className="mt-8 flex gap-4">
        {project.demoUrl && (
          <Button asChild><Link href={project.demoUrl} target="_blank">Live Demo</Link></Button>
        )}
        {project.githubUrl && (
          <Button variant="secondary" asChild><Link href={project.githubUrl} target="_blank">GitHub</Link></Button>
        )}
      </div>
    </main>
  );
}
