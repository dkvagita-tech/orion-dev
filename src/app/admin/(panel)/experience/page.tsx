import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Experience</h1>
      {items.map((e) => (
        <Card key={e.id} className="mb-3 p-4">
          <p className="font-medium">{e.role} at {e.company}</p>
          <p className="text-sm text-zinc-500">{e.status}</p>
        </Card>
      ))}
      {!items.length && <p className="text-zinc-500">Add experience from Prisma Studio or extend this CRUD page.</p>}
    </div>
  );
}
