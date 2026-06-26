import { prisma } from "@/lib/prisma";
import { getAnalyticsSummary } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { markMessageRead, deleteMessage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Messages</h1>
      <div className="space-y-3">
        {messages.map((msg) => (
          <Card key={msg.id} className={!msg.read ? "border-violet-500/30" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{msg.name} — {msg.email}</CardTitle>
                  <p className="text-xs text-zinc-500">{msg.createdAt.toLocaleString()}</p>
                  {msg.subject && <p className="text-sm text-zinc-400">{msg.subject}</p>}
                </div>
                <div className="flex gap-2">
                  {!msg.read && (
                    <form action={async () => { "use server"; await markMessageRead(msg.id); }}>
                      <Button size="sm" variant="secondary" type="submit">Mark Read</Button>
                    </form>
                  )}
                  <form action={async () => { "use server"; await deleteMessage(msg.id); }}>
                    <Button size="sm" variant="destructive" type="submit">Delete</Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-300">{msg.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
