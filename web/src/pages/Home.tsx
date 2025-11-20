
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto space-y-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Enterprise Knowledge OS
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search across your entire organization's knowledge base. Documents, meetings, screenshots, and more.
        </p>
      </div>

      <div className="w-full max-w-2xl relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Ask anything..." 
          className="pl-12 h-12 text-lg shadow-lg border-muted/40 focus-visible:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Docs</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            <CardDescription>Prepare for your day</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Knowledge Graph</CardTitle>
            <CardDescription>Explore connections</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
