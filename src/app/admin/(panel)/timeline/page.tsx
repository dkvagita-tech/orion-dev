import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function AdminTimelinePage() {
  const items = await prisma.timeline.findMany({ orderBy: { date: "desc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Timeline</h1>
      {items.map((t) => (
        <Card key={t.id} className="mb-3 p-4">
          <p className="font-medium">{t.title}</p>
          <p className="text-xs text-zinc-500">{formatDate(t.date)} · {t.type}</p>
        </Card>
      ))}
      {!items.length && <p className="text-zinc-500">No timeline events yet.</p>}
    </div>
  );
}
