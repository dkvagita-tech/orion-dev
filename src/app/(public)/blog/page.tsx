import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  await trackEvent("page_view", { path: "/blog" });

  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display mb-4 text-4xl font-bold">Blog</h1>
      <p className="mb-10 text-muted-foreground">Articles on web development, AI, and technology.</p>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="transition-all hover:border-violet-500/30">
              <CardContent className="p-6">
                <p className="text-xs text-violet-400">{post.category} · {post.readTime} min read</p>
                <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
