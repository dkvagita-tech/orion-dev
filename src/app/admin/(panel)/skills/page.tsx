import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Skills</h1>
      <div className="grid gap-2 sm:grid-cols-2">
        {skills.map((s) => (
          <Card key={s.id} className="p-4">
            <p className="font-medium">{s.name}</p>
            <p className="text-xs text-zinc-500">{s.category} · {s.level}% · {s.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
