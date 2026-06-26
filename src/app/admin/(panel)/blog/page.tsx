import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

async function AdminListPage({
  title,
  items,
  newHref,
}: {
  title: string;
  items: { id: string; label: string; sub?: string }[];
  newHref?: string;
}) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        {newHref && (
          <Button asChild>
            <Link href={newHref}><Plus className="h-4 w-4" /> Add New</Link>
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{item.label}</p>
              {item.sub && <p className="text-xs text-zinc-500">{item.sub}</p>}
            </div>
          </Card>
        ))}
        {!items.length && <p className="text-zinc-500">No items yet.</p>}
      </div>
    </div>
  );
}

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminListPage
      title="Blog Posts"
      newHref="/admin/blog/new"
      items={posts.map((p) => ({ id: p.id, label: p.title, sub: `${p.status} · ${p.slug}` }))}
    />
  );
}
