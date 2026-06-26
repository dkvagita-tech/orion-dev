import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminResumePage() {
  const resume = await prisma.resume.findFirst();
  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">Resume</h1>
      <Card>
        <CardContent className="p-6">
          <p className="whitespace-pre-wrap text-zinc-300">{resume?.summary || "No resume content yet."}</p>
          {resume?.fileUrl && (
            <a href={resume.fileUrl} className="mt-4 inline-block text-violet-400 hover:underline">
              Download file
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
