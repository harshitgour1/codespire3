import { useState } from "react";
import type { Document } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  File, 
  Image, 
  Video, 
  Link as LinkIcon,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentLibraryProps {
  documents: Document[];
}

export function DocumentLibrary({ documents }: DocumentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "docx":
        return FileText;
      case "xlsx":
        return File;
      case "image":
        return Image;
      case "video":
        return Video;
      case "url":
        return LinkIcon;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>
              All Documents
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("ready")}>
              Ready
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("processing")}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
              Failed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc, index) => {
          const Icon = getFileIcon(doc.type);
          
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {doc.title}
                        </CardTitle>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doc.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Source:</span>
                      <span className="font-medium">{doc.source}</span>
                    </div>
                    {doc.size && (
                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span className="font-medium">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {format(new Date(doc.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No documents found
        </div>
      )}
    </div>
  );
}
