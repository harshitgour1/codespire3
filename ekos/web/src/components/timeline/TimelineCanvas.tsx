import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { mockTimelineEvents } from "@/services/mock-timeline";
import type { TimelineItem } from "@/types/api";
import { Button } from "@/components/ui/button";

export function TimelineCanvas() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState<TimelineItem[]>(mockTimelineEvents);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Filter events by date range
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    let filtered = mockTimelineEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate <= end;
    });

    if (selectedSource) {
      filtered = filtered.filter(event => event.source === selectedSource);
    }

    // Sort by date descending
    filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredEvents(filtered);
  }, [currentMonth, selectedSource]);

  const sources = Array.from(new Set(mockTimelineEvents.map(e => e.source).filter(Boolean)));

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-8 text-xs"
          >
            Today
          </Button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedSource || ""}
            onChange={(e) => setSelectedSource(e.target.value || null)}
            className="text-sm border rounded-md px-2 py-1 bg-background"
          >
            <option value="">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 mx-auto opacity-50" />
              <p>No events found for this period</p>
            </div>
          </div>
        ) : (
          <div className="relative space-y-6 pb-8">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={`${event.date}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-3 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-lg" />

                  <Card className="hover:shadow-lg transition-all duration-200 border-l-2 border-l-primary/50 hover:border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-base text-foreground">
                            {event.title}
                          </h3>
                          {event.date && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(event.date), "MMM d, HH:mm")}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                        {event.source && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">{event.source}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t text-sm text-muted-foreground">
        Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} in {format(currentMonth, "MMMM yyyy")}
      </div>
    </div>
  );
}
