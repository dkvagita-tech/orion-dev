import { getAnalyticsSummary } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSummary(30);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Visitors", value: analytics.totalVisitors },
          { label: "Unique Visitors", value: analytics.uniqueVisitors },
          { label: "Returning Visitors", value: analytics.returningVisitors },
          { label: "AI Chat Sessions", value: analytics.aiChatUsage },
          { label: "Contact Submissions", value: analytics.contactSubmissions },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-400">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Device Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(analytics.deviceAnalytics).map(([device, count]) => (
            <div key={device} className="flex justify-between text-sm">
              <span className="capitalize">{device}</span>
              <span className="text-zinc-500">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
