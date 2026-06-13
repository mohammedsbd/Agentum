import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileText, Globe, Loader2, Upload } from "lucide-react";
import React, { useState } from "react";

interface AddKnowledgeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultTab: string;
  setDefaultTab: (tab: string) => void;
  onImport: (data: any) => Promise<string | null | void>;
  isLoading: boolean;
  existingSources: KnowledgeSource[];
}

const AddKnowledgeModal = ({
  isOpen,
  setIsOpen,
  defaultTab,
  setDefaultTab,
  onImport,
  isLoading,
  existingSources,
}: AddKnowledgeModalProps) => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [docsTitle, setDocsTitle] = useState("");
  const [docsContent, setDocsContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleImportWrapper = async () => {
    setError(null);
    const data: any = { type: defaultTab };

    if (defaultTab === "website") {
      if (!websiteUrl) {
        setError("Please enter a website URL.");
        return;
      }
      if (!validateUrl(websiteUrl)) {
        setError("Please enter a valid URL (e.g. https://example.com).");
        return;
      }

      const normalizedInput = websiteUrl.replace(/\/$/, "");
      const exists = existingSources.some((source) => {
        if (source.type !== "website" || !source.source_url) return false;
        const normalizedSource = source.source_url.replace(/\/$/, "");
        return normalizedSource === normalizedInput;
      });

      if (exists) {
        setError("This website is already in your knowledge base.");
        return;
      }

      data.url = websiteUrl;
    } else if (defaultTab === "text") {
      if (!docsTitle.trim()) {
        setError("Please enter a title.");
        return;
      }
      if (!docsContent.trim()) {
        setError("Please provide content.");
        return;
      }
      data.title = docsTitle;
      data.content = docsContent;
    } else if (defaultTab === "upload") {
      if (!uploadedFile) {
        setError("Please select a file to upload.");
        return;
      }
      data.file = uploadedFile;
    }

    const importError = await onImport(data);
    if (importError) {
      setError(importError);
      return;
    }

    setWebsiteUrl("");
    setDocsTitle("");
    setDocsContent("");
    setUploadedFile(null);
    setError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setError(null);
      }}
    >
      <DialogContent className="sm:max-w-xl bg-card border-border text-foreground p-0 overflow-hidden gap-0 shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">Add New Source</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Choose a content type to train your assistant.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="website"
          value={defaultTab}
          onValueChange={(value) => {
            setDefaultTab(value);
            setError(null);
          }}
          className="w-full"
        >
          <div className="px-6 border-b border-border">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="website"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0"
              >
                Website
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0"
              >
                Q&A / Text
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0"
              >
                File Upload
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 min-h-60 space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-destructive/10 border-destructive/20 text-destructive py-3"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 text-xs font-bold">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent
              value="website"
              className="mt-0 space-y-4 animate-in fade-in duration-300"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary text-sm flex gap-3">
                <Globe className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Crawl Website</p>
                  <p className="text-xs text-primary/80 mt-1 leading-relaxed font-medium">
                    Enter a website URL to crawl significantly or add a specific
                    page link to provide focused context.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website URL *</Label>
                <Input
                  placeholder="https://example.com"
                  className="bg-muted/20 border-border mt-1 font-medium"
                  value={websiteUrl}
                  onChange={(e) => {
                    setWebsiteUrl(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="text"
              className="mt-0 space-y-4 animate-in fade-in duration-300"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary text-sm flex gap-3">
                <FileText className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Raw Text</p>
                  <p className="text-xs text-primary/80 mt-1 leading-relaxed font-medium">
                    Paste existing FAQs, policies, or internal notes directly.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                <Input
                  placeholder="e.g. Refund Policy"
                  className="bg-muted/20 border-border font-medium"
                  value={docsTitle}
                  onChange={(e) => setDocsTitle(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content</Label>
                <Textarea
                  placeholder="Paste text here..."
                  className="bg-muted/20 border-border h-32 resize-none font-medium"
                  value={docsContent}
                  onChange={(e) => setDocsContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="upload"
              className="mt-0 space-y-4 animate-in fade-in duration-300"
            >
              <input
                type="file"
                id="knowledge-file-input"
                accept=".csv,.pdf,text/csv,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // 15MB cap
                  if (file.size > 15 * 1024 * 1024) {
                    setError("File size must be less than 15MB");
                    return;
                  }

                  const lowerName = file.name.toLowerCase();
                  const isCsv =
                    lowerName.endsWith(".csv") || file.type === "text/csv";
                  const isPdf =
                    lowerName.endsWith(".pdf") ||
                    file.type === "application/pdf";

                  if (!isCsv && !isPdf) {
                    setError("Only CSV and PDF files are allowed");
                    return;
                  }

                  setUploadedFile(file);
                  setError(null);
                }}
              />
              <div
                className="border-2 border-dashed border-border rounded-2xl h-64 flex flex-col items-center justify-center text-center p-6 hover:bg-muted/50 transition-all cursor-pointer group"
                onClick={() => {
                  document.getElementById("knowledge-file-input")?.click();
                }}
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground">
                  {uploadedFile
                    ? uploadedFile.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  CSV or PDF (max 15MB)
                </p>
              </div>
            </TabsContent>
          </div>

          <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="font-bold border-border"
            >
              Cancel
            </Button>
            <Button
              className={`font-bold px-8 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleImportWrapper}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Import Source"
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddKnowledgeModal;
