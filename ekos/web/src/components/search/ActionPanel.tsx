import type { ActionItem } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, FileText, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ActionPanelProps {
  actions: ActionItem[];
}

export function ActionPanel({ actions }: ActionPanelProps) {
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());

  if (actions.length === 0) {
    return null;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create_jira":
        return CheckCircle2;
      case "create_report":
        return FileText;
      case "send_email":
        return Mail;
      default:
        return Zap;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleActionClick = (index: number) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Suggested Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = getActionIcon(action.action);
          const isCompleted = completedActions.has(index);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`transition-all ${isCompleted ? 'opacity-60 bg-muted/50' : 'hover:shadow-md'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Icon className={`h-4 w-4 ${isCompleted ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {action.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        className="mt-2"
                        onClick={() => handleActionClick(index)}
                      >
                        {isCompleted ? (
                          <>
                            <AlertCircle className="mr-2 h-3 w-3" />
                            Undo
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Execute
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
