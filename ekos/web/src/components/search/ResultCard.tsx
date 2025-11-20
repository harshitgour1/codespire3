import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Image, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

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

  const colorMap = {
    document: "text-blue-600 bg-blue-50",
    meeting: "text-orange-600 bg-orange-50",
    image: "text-purple-600 bg-purple-50",
    chat: "text-green-600 bg-green-50"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorMap[type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  {title}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </CardTitle>
                <CardDescription className="text-xs mt-1 flex items-center gap-2">
                  <span>{source}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span>{date}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors">
              {type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
