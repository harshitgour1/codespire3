import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Image, MessageSquare } from "lucide-react";

interface ResultCardProps {
  title: string;
  type: 'document' | 'meeting' | 'image' | 'chat';
  snippet: string;
  date: string;
  source: string;
}

export function ResultCard({ title, type, snippet, date, source }: ResultCardProps) {
  const Icon = {
    document: FileText,
    meeting: Video,
    image: Image,
    chat: MessageSquare
  }[type];

  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base text-blue-600 hover:underline">{title}</CardTitle>
          </div>
          <Badge variant="outline">{source}</Badge>
        </div>
        <CardDescription className="text-xs">{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {snippet}
        </p>
      </CardContent>
    </Card>
  );
}
