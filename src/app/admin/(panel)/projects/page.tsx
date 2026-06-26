import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProject } from "@/app/admin/actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-zinc-400">Manage portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{project.title}</CardTitle>
                <p className="text-xs text-zinc-500">
                  {project.status} · {project.category} · {project.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/projects/${project.id}`}>
                    <Pencil className="h-3 w-3" />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteProject(project.id);
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </CardHeader>
          </Card>
        ))}
        {!projects.length && (
          <Card>
            <CardContent className="py-8 text-center text-zinc-500">
              No projects yet. Create your first project.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
