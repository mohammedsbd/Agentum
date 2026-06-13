import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Code, Copy } from "lucide-react";
import React, { useState } from "react";

const EmbedCodeConfig = ({ chatbotId }: { chatbotId: string | undefined }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    navigator.clipboard.writeText(
      `<script src="${process.env.NEXT_PUBLIC_WEBSITE_URI}/widget.js" data-id="${chatbotId}" defer></script>`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-muted bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
            Embed Code
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative group">
          <div className="bg-muted/50 border border-muted rounded-xl p-4 overflow-hidden">
            <code className="text-[11px] text-foreground font-mono font-bold block overflow-x-auto whitespace-pre">
              {`<script src="${process.env.NEXT_PUBLIC_WEBSITE_URI}/widget.js" \n  data-id="${
                chatbotId || "..."
              }" \n  defer>\n</script>`}
            </code>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="absolute top-3 right-3 h-8 w-8 bg-background shadow-sm hover:bg-muted transition-colors"
            onClick={handleCopyCode}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        <div className="flex items-start gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-600/90 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Paste this code before the closing &lt;/head&gt; tag on your
            website.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCodeConfig;
