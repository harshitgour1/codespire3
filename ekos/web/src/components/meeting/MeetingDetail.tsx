import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, FileText, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import type { Meeting } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MeetingDetailProps {
  meeting: Meeting;
}

export function MeetingDetail({ meeting }: MeetingDetailProps) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{meeting.title}</CardTitle>
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(meeting.date), "EEEE, MMMM d, yyyy 'at' HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{meeting.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{meeting.attendees.length} attendees</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Attendees */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Attendees
            </h3>
            <div className="flex flex-wrap gap-2">
              {meeting.attendees.map((attendee, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {attendee}
                </Badge>
              ))}
            </div>
          </div>

          {/* Summary */}
          {meeting.summary && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {meeting.summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Transcript and Action Items */}
      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Action Items ({meeting.action_items?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transcript
          </TabsTrigger>
        </TabsList>

        {/* Action Items */}
        <TabsContent value="actions" className="space-y-4">
          {meeting.action_items && meeting.action_items.length > 0 ? (
            meeting.action_items.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getPriorityIcon(item.priority)}</div>
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge
                            variant="outline"
                            className={getPriorityColor(item.priority)}
                          >
                            {item.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.action}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Circle className="h-5 w-5 text-muted-foreground mt-1" />
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No action items from this meeting</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Transcript */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Meeting Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.transcript ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                    {meeting.transcript.split('\n').map((line, idx) => (
                      <p key={idx} className={line.trim() === '' ? 'mb-2' : 'mb-1'}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Transcript not available for this meeting</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
