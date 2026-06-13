import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, RefreshCw, Send, User } from "lucide-react";
import React, { RefObject } from "react";

interface ChatSimulatorProps {
  messages: any[];
  primaryColor: string;
  sections: Section[];
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSectionClick: (name: string) => void;
  activeSection: string | null;
  isTyping: boolean;
  handleReset: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const ChatSimulator = ({
  messages,
  primaryColor,
  sections,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  handleSectionClick,
  activeSection,
  isTyping,
  handleReset,
  scrollRef,
}: ChatSimulatorProps) => {
  return (
    <Card className="flex-1 flex flex-col border-muted bg-card overflow-hidden relative shadow-2xl">
      <div className="h-14 border-b border-muted flex items-center justify-between px-6 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Test Environment
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-muted-foreground hover:text-foreground hover:bg-muted font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Reset
        </Button>
      </div>

      <ScrollArea className="flex-1 p-6 relative bg-muted/5">
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full flex-col",
                msg.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "flex max-w-[80%] gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-muted",
                    msg.role === "user" ? "bg-muted" : "text-white"
                  )}
                  style={
                    msg.role !== "user" ? { backgroundColor: primaryColor } : {}
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-muted text-foreground rounded-tr-sm"
                        : "bg-card border text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.isWelcome && sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.name)}
                          className="px-3 py-1.5 rounded-full border border-muted bg-muted/50 hover:bg-muted hover:border-primary/30 text-foreground text-xs font-bold transition-all shadow-sm"
                        >
                          {section.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] gap-3 flex-row">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-muted"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-card border text-foreground rounded-tl-sm shadow-sm flex items-end gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-card border-t border-muted">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!activeSection}
            placeholder={
              activeSection
                ? "Type a message..."
                : "Please select a category above to start..."
            }
            className="min-h-12.5 max-h-37.5 pr-12 outline-none text-foreground bg-muted/30 border-muted resize-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!activeSection || !input.trim()}
            className={cn(
              "absolute right-2 bottom-2 h-8 w-8 transition-colors shadow-sm",
              !activeSection || !input.trim() ? "bg-muted text-muted-foreground" : ""
            )}
            style={
              activeSection && input.trim()
                ? { backgroundColor: primaryColor, color: "white" }
                : {}
            }
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatSimulator;
