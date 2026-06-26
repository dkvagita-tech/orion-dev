import { prisma } from "@/lib/prisma";
import { getAnalyticsSummary } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FileText, MessageSquare, Bot, Eye } from "lucide-react";

export default async function AdminDashboardPage() {
  const [analytics, projectCount, blogCount, messageCount] = await Promise.all([
    getAnalyticsSummary(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Projects", value: projectCount, icon: FolderKanban },
    { label: "Blog Posts", value: blogCount, icon: FileText },
    { label: "Unread Messages", value: messageCount, icon: MessageSquare },
    { label: "Page Views (30d)", value: analytics.totalVisitors, icon: Eye },
    { label: "AI Chats (30d)", value: analytics.aiChatUsage, icon: Bot },
  ];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-zinc-400">Welcome back. Here&apos;s your portfolio overview.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{label}</CardTitle>
              <Icon className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topProjects.map((p) => (
              <div key={p.slug} className="flex justify-between text-sm">
                <span>{p.title}</span>
                <span className="text-zinc-500">{p.viewCount} views</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topBlogs.map((b) => (
              <div key={b.slug} className="flex justify-between text-sm">
                <span>{b.title}</span>
                <span className="text-zinc-500">{b.viewCount} views</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
