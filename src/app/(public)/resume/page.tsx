import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

export const metadata = { title: "Resume" };

export default async function ResumePage() {
  const [resume, settings] = await Promise.all([
    prisma.resume.findFirst(),
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold">Resume</h1>
        {resume?.fileUrl && (
          <Button asChild>
            <a href={resume.fileUrl} download>
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </Button>
        )}
      </div>
      <div className="rounded-2xl border border-white/10 bg-card p-8">
        <h2 className="text-2xl font-bold">{settings?.siteName}</h2>
        <p className="text-violet-400">{settings?.tagline}</p>
        <p className="mt-4 text-muted-foreground">{resume?.summary || settings?.bio}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          {settings?.email} · {settings?.location}
        </p>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Want a tailored match? Use the AI assistant&apos;s <strong>Job Match</strong> tab.
      </p>
      <div className="mt-4 text-center">
        <Button variant="secondary" asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </main>
  );
}
