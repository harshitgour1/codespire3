import type { TimelineItem } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface TimelineViewProps {
    items: TimelineItem[];
}

export function TimelineView({ items }: TimelineViewProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Timeline
            </h3>
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                <div className="space-y-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative pl-12"
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm" />

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-semibold text-sm text-foreground">
                                                {item.title}
                                            </h4>
                                            {item.date && (
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {format(new Date(item.date), "MMM d, yyyy")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                        {item.source && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{item.source}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
