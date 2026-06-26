import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default async function HomePage() {
  try {
    await trackEvent("page_view", { path: "/" });
  } catch {}

  let settings = null;
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  let services: Awaited<ReturnType<typeof prisma.service.findMany>> = [];
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];

  try {
    [settings, projects, skills, services, testimonials] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "site" } }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
        take: 6,
      }),
      prisma.skill.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 8 }),
      prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 4 }),
      prisma.testimonial.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 3 }),
    ]);
  } catch {
    // Database not configured
  }

  const name = settings?.siteName || "M Hasnat Khan";
  const tagline = settings?.tagline || "Frontend Developer & AI Enthusiast";
  const bio = settings?.bio || "Crafting clean, responsive, and intelligent digital experiences.";

  return (
    <main>
      <section className="relative flex min-h-[90vh] items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {settings?.available && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Available for freelance work
            </div>
          )}
          <h1 className="font-display animate-fade-in-up text-5xl font-bold tracking-tight md:text-7xl">
            {name}
          </h1>
          <p className="mt-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
            {tagline}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{bio}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/resume">
                <Download className="h-4 w-4" /> Resume
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Try the AI assistant — bottom right corner
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display mb-10 text-center text-3xl font-bold">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <Card className="group h-full transition-all hover:-translate-y-1 hover:border-violet-500/30">
                {project.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display mb-10 text-center text-3xl font-bold">Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="p-4 text-center">
                <p className="font-medium">{skill.name}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${skill.level}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display mb-10 text-center text-3xl font-bold">Services</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="border-t border-white/10 bg-white/[0.02] py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-display mb-10 text-center text-3xl font-bold">Testimonials</h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <Card key={t.id} className="p-6">
                  <p className="italic text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                  <p className="mt-3 font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
