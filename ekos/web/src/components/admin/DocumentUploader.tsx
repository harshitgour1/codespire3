import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ingestAPI } from "@/services/api";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export function DocumentUploader() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles(prev => [...prev, ...uploadFiles]);

    // Upload each file
    for (const uploadFile of uploadFiles) {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);

        await ingestAPI.uploadFile(uploadFile.file, 'manual_upload', {
          uploaded_by: 'user',
          upload_date: new Date().toISOString(),
        });

        clearInterval(progressInterval);

        setFiles(prev => prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, progress: 100, status: 'success', message: 'Upload complete' }
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', message: 'Upload failed' }
            : f
        ));
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20'
          }
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md"
        />
        
        <div className="space-y-4 pointer-events-none">
          <div className="p-4 bg-background rounded-full shadow-sm inline-block">
            <Upload className={`h-8 w-8 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isDragging ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, Word, Excel, PowerPoint, and text files
            </p>
          </div>
          <Button variant="secondary" className="pointer-events-auto">
            Select Files
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        uploadFile.status === 'success' ? 'bg-green-50' :
                        uploadFile.status === 'error' ? 'bg-red-50' :
                        'bg-blue-50'
                      }`}>
                        {uploadFile.status === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : uploadFile.status === 'error' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium truncate">
                            {uploadFile.file.name}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        
                        {uploadFile.status === 'uploading' && (
                          <Progress value={uploadFile.progress} className="h-1" />
                        )}
                        
                        {uploadFile.message && (
                          <p className={`text-xs mt-1 ${
                            uploadFile.status === 'success' ? 'text-green-600' :
                            uploadFile.status === 'error' ? 'text-red-600' :
                            'text-muted-foreground'
                          }`}>
                            {uploadFile.message}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
