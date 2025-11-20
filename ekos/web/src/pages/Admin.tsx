import { Button } from "@/components/ui/button";
import { Plus, HardDrive, Slack, Trello, FileText } from "lucide-react";
import { ConnectorCard } from "@/components/admin/ConnectorCard";

export default function Admin() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integrations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Connector
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConnectorCard 
          name="Google Drive" 
          description="Sync documents, spreadsheets, and presentations." 
          icon={<HardDrive className="h-5 w-5 text-blue-500" />} 
          connected={true} 
        />
        <ConnectorCard 
          name="Slack" 
          description="Index public channels and threads." 
          icon={<Slack className="h-5 w-5 text-purple-500" />} 
          connected={true} 
        />
        <ConnectorCard 
          name="Jira" 
          description="Track tickets, epics, and sprints." 
          icon={<Trello className="h-5 w-5 text-blue-400" />} 
          connected={false} 
        />
        <ConnectorCard 
          name="Confluence" 
          description="Knowledge base and documentation." 
          icon={<FileText className="h-5 w-5 text-blue-600" />} 
          connected={false} 
        />
      </div>
    </div>
  );
}
