import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminServicesPage() {
  const items = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Services</h1>
      {items.map((s) => (
        <Card key={s.id} className="mb-3 p-4">
          <p className="font-medium">{s.title}</p>
          <p className="text-sm text-zinc-500">{s.description}</p>
        </Card>
      ))}
    </div>
  );
}
