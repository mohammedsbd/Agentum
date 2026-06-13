import { Button } from "@/components/ui/button";
import { File, Globe, Upload } from "lucide-react";

const QuickActions = ({
  onOpenModal,
}: {
  onOpenModal: (tab: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Button
        variant="outline"
        className="h-auto py-10 px-6 flex flex-col items-center justify-center gap-4 border-border bg-card hover:bg-muted transition-all group whitespace-normal shadow-sm"
        onClick={() => onOpenModal("website")}
      >
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2 text-center w-full">
          <span className="text-base font-bold block whitespace-normal text-foreground">
            Add Website
          </span>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed whitespace-normal wrap-break-word max-w-[200px] mx-auto">
            Crawl your website or specific pages to automatically keep your
            knowledge base in sync.
          </p>
        </div>
      </Button>
      <Button
        variant="outline"
        className="h-auto py-10 px-6 flex flex-col items-center justify-center gap-4 border-border bg-card hover:bg-muted transition-all group whitespace-normal shadow-sm"
        onClick={() => onOpenModal("upload")}
      >
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-colors">
          <Upload className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="space-y-2 text-center w-full">
          <span className="text-base font-bold block whitespace-normal text-foreground">
            Upload File
          </span>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed whitespace-normal wrap-break-word max-w-[200px] mx-auto">
            Upload CSV or PDF files to instantly train your assistant with existing
            documents.
          </p>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-auto py-10 px-6 flex flex-col items-center justify-center gap-4 border-border bg-card hover:bg-muted transition-all group whitespace-normal shadow-sm"
        onClick={() => onOpenModal("text")}
      >
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 group-hover:bg-amber-500/10 transition-colors">
          <File className="w-8 h-8 text-amber-500" />
        </div>
        <div className="space-y-2 text-center w-full">
          <span className="text-base font-bold block whitespace-normal text-foreground">Manual Text</span>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed whitespace-normal wrap-break-word max-w-[200px] mx-auto">
            Manually copy-paste FAQs, internal notes, or policies directly into the editor for quick updates.
          </p>
        </div>
      </Button>
    </div>
  );
};

export default QuickActions;
