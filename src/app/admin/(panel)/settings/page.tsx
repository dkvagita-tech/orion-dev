import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">Site Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile & AI Context</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              await updateSiteSettings({
                siteName: formData.get("siteName") as string,
                tagline: formData.get("tagline") as string,
                bio: formData.get("bio") as string,
                email: formData.get("email") as string,
                location: formData.get("location") as string,
                available: formData.get("available") === "on",
                githubUsername: formData.get("githubUsername") as string,
                aiJourney: formData.get("aiJourney") as string,
                currentlyLearning: String(formData.get("currentlyLearning"))
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" name="siteName" defaultValue={settings?.siteName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={settings?.tagline} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={settings?.bio} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={settings?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={settings?.location} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUsername">GitHub Username</Label>
              <Input id="githubUsername" name="githubUsername" defaultValue={settings?.githubUsername || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiJourney">AI Journey (used by AI assistant)</Label>
              <Textarea id="aiJourney" name="aiJourney" defaultValue={settings?.aiJourney || ""} className="min-h-[120px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentlyLearning">Currently Learning (comma-separated)</Label>
              <Input id="currentlyLearning" name="currentlyLearning" defaultValue={settings?.currentlyLearning?.join(", ")} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="available" defaultChecked={settings?.available} />
              Available for freelance
            </label>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
