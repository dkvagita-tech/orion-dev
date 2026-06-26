import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await trackEvent("page_view", { path: "/projects" });

  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display mb-4 text-4xl font-bold">Projects</h1>
      <p className="mb-10 text-muted-foreground">Explore my work — or ask the AI assistant to filter by tech stack.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="group h-full transition-all hover:-translate-y-1 hover:border-violet-500/30">
              {project.imageUrl && (
                <img src={project.imageUrl} alt={project.title} className="aspect-video w-full rounded-t-2xl object-cover" loading="lazy" />
              )}
              <CardContent className="p-5">
                <div className="mb-2 flex gap-2">
                  {project.featured && <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">Featured</span>}
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{project.category}</span>
                </div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
