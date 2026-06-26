import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Testimonials</h1>
      {items.map((t) => (
        <Card key={t.id} className="mb-3 p-4">
          <p className="italic text-zinc-400">&ldquo;{t.content}&rdquo;</p>
          <p className="mt-2 font-medium">{t.name} — {t.role}</p>
        </Card>
      ))}
    </div>
  );
}
