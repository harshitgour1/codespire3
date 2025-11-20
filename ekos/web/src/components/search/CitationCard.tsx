import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Citation } from "@/types/api";
import { FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface CitationCardProps {
    citation: Citation;
    index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
    const sourceColors: Record<string, string> = {
        "Google Drive": "bg-blue-50 text-blue-700 border-blue-200",
        "Slack": "bg-purple-50 text-purple-700 border-purple-200",
        "Zoom": "bg-orange-50 text-orange-700 border-orange-200",
        "Confluence": "bg-cyan-50 text-cyan-700 border-cyan-200",
        "Figma": "bg-pink-50 text-pink-700 border-pink-200",
    };

    const source = citation.metadata?.source || "Unknown";
    const title = citation.metadata?.title || citation.doc_id;
    const colorClass = sourceColors[source] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/30 hover:border-l-primary">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className={`text-xs ${colorClass}`}>
                                        {source}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Relevance: {Math.round(citation.score * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {citation.text}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
