import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function MeetingList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="cursor-pointer hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Weekly Sync - Engineering</CardTitle>
            <CardDescription>Oct 24, 2023 • 45 mins</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
