"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message"),
        honeypot: form.get("website"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to send message");
      setStatus("error");
      return;
    }

    setStatus("success");
    e.currentTarget.reset();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display mb-4 text-4xl font-bold">Contact</h1>
      <p className="mb-10 text-muted-foreground">Let&apos;s work together on your next project.</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required rows={5} />
              </div>
              {status === "success" && <p className="text-sm text-green-400">Message sent successfully!</p>}
              {status === "error" && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">dk.vagita@gmail.com</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Location</h3>
            <p className="text-muted-foreground">Pakistan</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Use the floating AI button to ask about availability, projects, and skills instantly.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
