import { ScreenshotUploader } from "@/components/screenshot/ScreenshotUploader";
import { ScreenshotMatchList } from "@/components/screenshot/ScreenshotMatchList";

export default function ScreenshotSearch() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Screenshot Search</h1>
        <p className="text-muted-foreground">Upload a screenshot to find its source, code, or related docs.</p>
      </div>

      <ScreenshotUploader />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Matches</h2>
        <ScreenshotMatchList />
      </div>
    </div>
  );
}
