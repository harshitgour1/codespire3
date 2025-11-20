import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your workspace preferences.</p>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="workspace-name">Workspace Name</Label>
          <Input id="workspace-name" defaultValue="My Organization" />
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
