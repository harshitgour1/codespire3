import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export function ScreenshotUploader() {
  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/5 transition-colors cursor-pointer">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-background rounded-full shadow-sm">
          <UploadCloud className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Upload Screenshot</h3>
          <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
        </div>
        <Button variant="secondary">Select File</Button>
      </div>
    </div>
  );
}
