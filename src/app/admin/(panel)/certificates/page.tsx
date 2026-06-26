import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminCertificatesPage() {
  const items = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Certificates</h1>
      {items.map((c) => (
        <Card key={c.id} className="mb-3 p-4">
          <p className="font-medium">{c.title}</p>
          <p className="text-sm text-zinc-500">{c.issuer}</p>
        </Card>
      ))}
      {!items.length && <p className="text-zinc-500">No certificates yet.</p>}
    </div>
  );
}
