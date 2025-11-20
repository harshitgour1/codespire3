import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SearchFilters() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Filters</h3>
      <div className="space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start">All</Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">Documents</Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">Meetings</Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">Images</Button>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Source</h4>
        <Button variant="ghost" size="sm" className="w-full justify-start">Google Drive</Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">Slack</Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">Jira</Button>
      </div>
    </div>
  );
}
