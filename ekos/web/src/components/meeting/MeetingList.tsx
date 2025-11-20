import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { mockMeetings } from "@/services/mock-data";
import type { Meeting } from "@/types/api";
import { MeetingDetail } from "./MeetingDetail";

export function MeetingList() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {selectedMeeting ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedMeeting(null)}
            className="mb-4"
          >
            ← Back to Meetings
          </Button>
          <MeetingDetail meeting={selectedMeeting} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Meetings</h2>
              <p className="text-muted-foreground mt-1">
                {mockMeetings.length} meetings recorded
              </p>
            </div>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            <AnimatePresence>
              {mockMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50 hover:border-l-primary"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="text-lg hover:text-primary transition-colors">
                            {meeting.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(meeting.date), "MMM d, yyyy 'at' HH:mm")}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{meeting.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>{meeting.attendees.length} attendees</span>
                            </div>
                          </CardDescription>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {meeting.summary && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {meeting.summary}
                        </p>
                      )}
                      
                      {/* Action Items Preview */}
                      {meeting.action_items && meeting.action_items.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>Action Items ({meeting.action_items.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {meeting.action_items.slice(0, 3).map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className={getPriorityColor(item.priority)}
                              >
                                {item.title}
                              </Badge>
                            ))}
                            {meeting.action_items.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{meeting.action_items.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Attendees */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {meeting.attendees.map((attendee, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Time ago */}
                      <div className="mt-3 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(meeting.date), { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
