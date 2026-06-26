import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminSocialPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Social Links</h1>
      {links.map((l) => (
        <Card key={l.id} className="mb-3 flex items-center justify-between p-4">
          <span className="font-medium">{l.platform}</span>
          <a href={l.url} className="text-sm text-violet-400" target="_blank" rel="noopener noreferrer">{l.url}</a>
        </Card>
      ))}
      {!links.length && <p className="text-zinc-500">No social links yet.</p>}
    </div>
  );
}
