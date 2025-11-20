import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
}

export function ConnectorCard({ name, description, icon, connected }: ConnectorCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {name}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">{description}</div>
        <div className="flex items-center justify-between">
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Active" : "Disconnected"}
          </Badge>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
      </CardContent>
    </Card>
  );
}
