import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return { title: post?.title, description: post?.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, status: "PUBLISHED" } });

  if (!post) notFound();

  await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
  await trackEvent("blog_view", { path: `/blog/${slug}`, slug });

  const related = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", category: post.category, NOT: { id: post.id } },
    take: 3,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm text-violet-400">{post.category} · {post.readTime} min read</p>
      <h1 className="font-display mt-2 text-4xl font-bold">{post.title}</h1>
      <article className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap">{post.content}</article>

      {related.length > 0 && (
        <section className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-4 text-xl font-semibold">Related Articles</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id}>
                <a href={`/blog/${r.slug}`} className="text-violet-400 hover:underline">{r.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
