import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Settings,
  TrendingUp,
  Clock,
  Database
} from "lucide-react";

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  documentsCount?: number;
  syncFrequency?: string;
}

export function ConnectorCard({ 
  name, 
  description, 
  icon, 
  connected,
  lastSync = "2 hours ago",
  documentsCount = 0,
  syncFrequency = "Every 6 hours"
}: ConnectorCardProps) {
  const [isConnected, setIsConnected] = useState(connected);
  const [isSyncing, setIsSyncing] = useState(false);
  const [docs, setDocs] = useState(documentsCount);

  const handleToggleConnection = () => {
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setDocs(0);
    } else {
      // Connect and simulate sync
      setIsConnected(true);
      setIsSyncing(true);
      
      // Simulate initial sync
      let count = 0;
      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 50) + 10;
        setDocs(count);
        
        if (count > documentsCount) {
          clearInterval(interval);
          setDocs(documentsCount);
          setIsSyncing(false);
        }
      }, 200);
    }
  };

  const handleSync = () => {
    if (!isConnected) return;
    
    setIsSyncing(true);
    const currentDocs = docs;
    const newDocs = Math.floor(Math.random() * 20) + 5;
    
    let count = currentDocs;
    const interval = setInterval(() => {
      count += 1;
      setDocs(count);
      
      if (count >= currentDocs + newDocs) {
        clearInterval(interval);
        setIsSyncing(false);
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        isConnected 
          ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-white hover:shadow-lg' 
          : 'border-gray-200 hover:shadow-md'
      }`}>
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isConnected ? 'bg-green-500' : 'bg-gray-300'
        }`} />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${
                isConnected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {icon}
              </div>
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {name}
                  {isConnected ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats - only show when connected */}
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3 text-xs"
            >
              <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                <Database className="h-3.5 w-3.5 text-blue-600" />
                <div>
                  <p className="text-muted-foreground">Documents</p>
                  <p className="font-semibold text-foreground">
                    {isSyncing ? `${docs}...` : docs.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                <Clock className="h-3.5 w-3.5 text-orange-600" />
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-semibold text-foreground">{lastSync}</p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-2 p-2 bg-background rounded-lg">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <div>
                  <p className="text-muted-foreground">Sync Frequency</p>
                  <p className="font-semibold text-foreground">{syncFrequency}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-gray-100 text-gray-600"
              }
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : isConnected ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isConnected ? "outline" : "default"}
              onClick={handleToggleConnection}
              disabled={isSyncing}
              className="flex-1"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
            
            {isConnected && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
