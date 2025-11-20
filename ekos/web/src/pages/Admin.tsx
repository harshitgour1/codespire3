import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Database, Upload as UploadIcon } from "lucide-react";
import { ConnectorCard } from "@/components/admin/ConnectorCard";
import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { DocumentLibrary } from "@/components/admin/DocumentLibrary";
import { motion } from "framer-motion";
import { documentsAPI } from "@/services/api";
import type { Document } from "@/types/api";

export default function Admin() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await documentsAPI.list();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectors = [
    {
      name: "Google Drive",
      description: "Sync documents, spreadsheets, and presentations.",
      icon: <Database className="h-5 w-5 text-blue-500" />,
      connected: true,
      lastSync: "2 hours ago",
      documentsCount: 1247,
      syncFrequency: "Every 6 hours"
    },
    {
      name: "Slack",
      description: "Index public channels and threads.",
      icon: <Database className="h-5 w-5 text-purple-500" />,
      connected: true,
      lastSync: "30 mins ago",
      documentsCount: 3892,
      syncFrequency: "Real-time"
    },
    {
      name: "Jira",
      description: "Track tickets, epics, and sprints.",
      icon: <Database className="h-5 w-5 text-blue-400" />,
      connected: false,
      documentsCount: 856,
      syncFrequency: "Every 12 hours"
    },
    {
      name: "Confluence",
      description: "Knowledge base and documentation.",
      icon: <Database className="h-5 w-5 text-blue-600" />,
      connected: false,
      documentsCount: 534,
      syncFrequency: "Every 6 hours"
    },
    {
      name: "Zoom",
      description: "Meeting recordings and transcripts.",
      icon: <Database className="h-5 w-5 text-indigo-500" />,
      connected: true,
      lastSync: "1 hour ago",
      documentsCount: 127,
      syncFrequency: "After each meeting"
    },
    {
      name: "Figma",
      description: "Design files and prototypes.",
      icon: <Database className="h-5 w-5 text-pink-500" />,
      connected: true,
      lastSync: "4 hours ago",
      documentsCount: 89,
      syncFrequency: "Every 24 hours"
    },
    {
      name: "GitHub",
      description: "Repositories, issues, and pull requests.",
      icon: <Database className="h-5 w-5 text-gray-700" />,
      connected: false,
      documentsCount: 2341,
      syncFrequency: "Every 1 hour"
    },
    {
      name: "Notion",
      description: "Workspaces, databases, and pages.",
      icon: <Database className="h-5 w-5 text-black" />,
      connected: false,
      documentsCount: 678,
      syncFrequency: "Every 6 hours"
    }
  ];

  const connectedCount = connectors.filter(c => c.connected).length;
  const totalDocs = connectors
    .filter(c => c.connected)
    .reduce((sum, c) => sum + c.documentsCount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground mt-1">
            Manage integrations and documents
          </p>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-muted-foreground">Connected</p>
            <p className="text-2xl font-bold text-primary">{connectedCount}/{connectors.length}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Total Docs</p>
            <p className="text-2xl font-bold text-primary">{totalDocs.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">
            Integrations ({connectedCount}/{connectors.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Available Connectors</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Custom Connector
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConnectorCard {...connector} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Document Library ({documents.length})
            </h3>
            <Button variant="outline" onClick={loadDocuments}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading documents...
            </div>
          ) : (
            <DocumentLibrary documents={documents} />
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
              <UploadIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Add files to your knowledge base
              </p>
            </div>
          </div>

          <DocumentUploader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
