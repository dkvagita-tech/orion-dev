"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProject } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await createProject({
      title: form.get("title"),
      slug: form.get("slug") || slugify(String(form.get("title"))),
      description: form.get("description"),
      content: form.get("content"),
      imageUrl: form.get("imageUrl") || undefined,
      demoUrl: form.get("demoUrl") || undefined,
      githubUrl: form.get("githubUrl") || undefined,
      techStack: String(form.get("techStack")).split(",").map((s) => s.trim()).filter(Boolean),
      category: form.get("category"),
      tags: String(form.get("tags")).split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.get("featured") === "on",
      difficulty: form.get("difficulty"),
      status: form.get("status"),
      order: Number(form.get("order")) || 0,
    });

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">New Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="auto-generated from title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown/HTML)</Label>
              <Textarea id="content" name="content" className="min-h-[200px]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue="web" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select id="difficulty" name="difficulty" className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input id="techStack" name="techStack" placeholder="React, TypeScript, Node.js" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" placeholder="ai, fullstack, ui" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input id="demoUrl" name="demoUrl" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" /> Featured
              </label>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
