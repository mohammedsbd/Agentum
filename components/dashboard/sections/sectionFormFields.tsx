import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  extraction_status?: string | null;
}

interface SectionFormFieldsProps {
  formData: SectionFormData;
  setFormData: (data: SectionFormData) => void;
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
  knowledgeSources: KnowledgeSource[];
  isLoadingSources: boolean;
  isDisabled: boolean;
}

const TONE_OPTIONS = [
  {
    value: "strict",
    label: "Strict",
    badge: "Fact-based",
    description: "Only answer if fully confident. No small talk.",
  },
  {
    value: "neutral",
    label: "Neutral",
    description: "Professional, concise, and direct.",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and conversational. Good for general FAQ.",
  },
  {
    value: "empathetic",
    label: "Empathetic",
    description: "Support-first, apologetic, and calming.",
  },
];

const SectionFormFields = ({
  formData,
  setFormData,
  selectedSources,
  setSelectedSources,
  knowledgeSources,
  isLoadingSources,
  isDisabled,
}: SectionFormFieldsProps) => {
  return (
    <>
      <div className="space-y-6">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
          Basics
        </h4>
        <div className="space-y-2">
          <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Section Name</Label>
          <Input
            placeholder="e.g. Billing Policy"
            className="bg-muted/20 border-border text-foreground font-medium"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Description</Label>
          <Input
            placeholder="When should the AI use this?"
            className="bg-muted/20 border-border text-foreground font-medium"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isDisabled}
          />
          <p className="text-[11px] text-muted-foreground font-medium">
            Used by the routing model to decide when to activate this section.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Data Sources
            </h4>
            <span className="text-[10px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-full">
              {selectedSources.length} attached
            </span>
          </div>
          <Select
            value={selectedSources[0] || ""}
            onValueChange={(value) => {
              if (!selectedSources.includes(value)) {
                setSelectedSources([...selectedSources, value]);
              }
            }}
            disabled={isDisabled}
          >
            <SelectTrigger className="bg-muted/20 border-border text-foreground font-medium">
              <SelectValue
                placeholder={
                  isLoadingSources
                    ? "Loading sources..."
                    : "Select knowledge sources..."
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground shadow-2xl">
              {knowledgeSources.length > 0 ? (
                knowledgeSources?.map((source) => (
                  <SelectItem key={source.id} value={source.id} className="focus:bg-primary/5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                        [{source.type}]
                      </span>
                      <span className="font-medium">{source.name}</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No ready knowledge sources available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {selectedSources?.length > 0 && (
            <div className="space-y-2">
              {selectedSources?.map((sourceId) => {
                const source = knowledgeSources?.find((s) => s.id === sourceId);
                if (!source) return null;
                return (
                  <div
                    key={sourceId}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border shadow-sm group hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter bg-muted px-1.5 py-0.5 rounded border border-border">
                        {source.type}
                      </span>
                      <span className="text-sm text-foreground font-bold">
                        {source.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      onClick={() =>
                        setSelectedSources(
                          selectedSources.filter((id) => id !== sourceId)
                        )
                      }
                      disabled={isDisabled}
                    >
                      <span className="text-xl leading-none">×</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
            Tone
          </h4>

          <RadioGroup
            value={formData.tone}
            onValueChange={(value) =>
              setFormData({ ...formData, tone: value as Tone })
            }
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            disabled={isDisabled}
          >
            {TONE_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 rounded-xl border p-4 hover:bg-muted transition-all duration-200 cursor-pointer",
                  formData.tone === option.value 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border bg-card shadow-xs"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="border-primary text-primary"
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold text-sm">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-sm border border-primary/10 font-bold uppercase tracking-tighter">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium leading-tight block mt-0.5">
                    {option.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
            Scope Rules
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Allowed Topics</Label>
              <Input
                className="bg-muted/20 border-border text-foreground font-medium text-xs h-10"
                placeholder="e.g. pricing, refunds"
                value={formData.allowedTopics}
                onChange={(e) =>
                  setFormData({ ...formData, allowedTopics: e.target.value })
                }
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Blocked Topics</Label>
              <Input
                className="bg-muted/20 border-border text-foreground font-medium text-xs h-10"
                placeholder="e.g. competitors"
                value={formData.blockedTopics}
                onChange={(e) =>
                  setFormData({ ...formData, blockedTopics: e.target.value })
                }
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionFormFields;
