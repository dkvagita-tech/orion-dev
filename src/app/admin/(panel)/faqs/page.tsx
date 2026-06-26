import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminFAQsPage() {
  const items = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">FAQs</h1>
      {items.map((f) => (
        <Card key={f.id} className="mb-3 p-4">
          <p className="font-medium">{f.question}</p>
          <p className="mt-1 text-sm text-zinc-500">{f.answer}</p>
        </Card>
      ))}
    </div>
  );
}
