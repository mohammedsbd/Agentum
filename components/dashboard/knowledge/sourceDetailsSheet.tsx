import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { getExtractionBadge, getStatusBadge, getTypeIcon } from "./knowledgeTable";
import { Button } from "@/components/ui/button";

interface SourceDetailsSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSource: KnowledgeSource | null;
  onDisconnect?: (sourceId: string) => Promise<void>;
}

const SourceDetailsSheet = ({
  isOpen,
  setIsOpen,
  selectedSource,
  onDisconnect,
}: SourceDetailsSheetProps) => {
  const [disconnecting, setDisconnecting] = useState(false);
  if (!selectedSource) return null;
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-card p-0 shadow-2xl">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-xl text-foreground flex items-center gap-2 font-bold">
              {getTypeIcon(selectedSource.type as SourceType)}
              {selectedSource.name}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground font-medium">
              {selectedSource.source_url || "Manual entry"}
            </SheetDescription>
            <div className="pt-4 flex flex-wrap gap-2">
              {getStatusBadge(selectedSource.status as SourceStatus)}
              {getExtractionBadge(selectedSource)}
            </div>
            <div className="pt-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Last Updated: {" "}
              {selectedSource.last_updated &&
                new Date(selectedSource.last_updated).toLocaleDateString()}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedSource.extraction_status === "failed" && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <p className="font-bold text-destructive">This source is not available to the chatbot.</p>
                <p className="mt-1 font-medium opacity-90">
                  {selectedSource.extraction_error ||
                    "The source could not be extracted and indexed."}
                </p>
                <p className="mt-2 opacity-80 font-medium">
                  Delete it and upload a text-based PDF, or paste the PDF text as a text source.
                </p>
              </div>
            )}
            {selectedSource.extraction_status === "ready" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 font-medium">
                This source is indexed and available to the chatbot.
                {selectedSource.chunk_count ? ` Indexed chunks: ${selectedSource.chunk_count}.` : ""}
              </div>
            )}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Content Preview
              </h4>
              <div className="p-4 rounded-xl border border-border bg-muted/30 font-mono text-[11px] text-foreground h-80 overflow-y-auto leading-relaxed shadow-inner">
                {selectedSource.content ||
                  `# ${selectedSource.name}\n\n(No content preview available)`}
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-border bg-muted/20">
            <Button
              variant="destructive"
              className="w-full font-bold"
              disabled={disconnecting}
              onClick={async () => {
                if (!onDisconnect) return;
                setDisconnecting(true);
                try {
                  await onDisconnect(selectedSource.id);
                } finally {
                  setDisconnecting(false);
                }
              }}
            >
              {disconnecting ? "Deleting..." : "Delete Source"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SourceDetailsSheet;
