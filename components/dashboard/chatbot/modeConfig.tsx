import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatbotMode = "text" | "voice" | "both";

interface ModeConfigProps {
  mode: ChatbotMode;
  setMode: (m: ChatbotMode) => void;
}

const OPTIONS: { value: ChatbotMode; label: string; hint: string }[] = [
  { value: "text", label: "Text only", hint: "Visitors type to chat" },
  { value: "voice", label: "Voice only", hint: "Visitors talk to a voice agent" },
  { value: "both", label: "Text and voice", hint: "Visitors choose per session" },
];

const ModeConfig = ({ mode, setMode }: ModeConfigProps) => {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-xs font-bold text-foreground uppercase tracking-widest">
            Conversation Mode
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200",
              mode === opt.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-border hover:bg-muted"
            )}
          >
            <input
              type="radio"
              name="chatbot-mode"
              value={opt.value}
              checked={mode === opt.value}
              onChange={() => setMode(opt.value)}
              className="mt-1 accent-primary"
            />
            <div>
              <Label className="text-foreground text-sm font-bold cursor-pointer">
                {opt.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {opt.hint}
              </p>
            </div>
          </label>
        ))}
      </CardContent>
    </Card>
  );
};

export default ModeConfig;
