import { Card, CardContent } from "@/components/ui/card";

export function ScreenshotMatchList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="aspect-video bg-muted rounded-md mb-4" />
          <h4 className="font-medium">Login Page Design</h4>
          <p className="text-sm text-muted-foreground">Found in Figma / Design System</p>
        </CardContent>
      </Card>
      {/* More items... */}
    </div>
  );
}
