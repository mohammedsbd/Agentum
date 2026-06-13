"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Loader2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Search,
  Send,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useEffectEvent, useRef, useState } from "react";

interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  email?: string;
  visitor_ip?: string;
  channel?: "text" | "voice";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const ConversationPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);

      try {
        const res = await fetch(`/api/conversations/${selectedId}/messages`);
        const data = await res.json();
        setCurrentMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoadingMessages]);

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedId) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/conversations/${selectedId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (res.ok) {
        const newMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: replyContent,
          created_at: new Date().toISOString(),
        };
        setCurrentMessages((prev) => [...prev, newMsg]);
        setReplyContent("");

        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, lastMessage: replyContent, time: "Just now" }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to send reply", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations?.find((c) => c.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background animate-in fade-in duration-500">
      <div className="w-87.5 md:w-100 flex flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Inbox</h1>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
              {filteredConversations.length} Active
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 h-11 bg-muted/20 border-border text-sm font-medium focus-visible:ring-primary/20 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-20 px-6">
                <MessageSquare className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm font-medium">No conversations found</p>
              </div>
            ) : (
              filteredConversations?.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedId(conversation.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 p-5 text-left transition-all border-b border-border group relative",
                    selectedId === conversation.id
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/50 border-l-4 border-l-transparent"
                  )}
                >
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border",
                          selectedId === conversation.id ? "bg-primary border-primary" : "bg-muted border-border"
                        )}>
                          {conversation.channel === "voice" ? (
                            <Mic className={cn("w-4 h-4", selectedId === conversation.id ? "text-primary-foreground" : "text-primary")} />
                          ) : (
                            <MessageSquare className={cn("w-4 h-4", selectedId === conversation.id ? "text-primary-foreground" : "text-muted-foreground")} />
                          )}
                        </div>
                        <span
                          className={cn(
                            "font-bold text-sm truncate max-w-[140px]",
                            selectedId === conversation.id
                              ? "text-foreground"
                              : "text-foreground/80"
                          )}
                        >
                          {conversation.user}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {conversation.time}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium line-clamp-1 w-full pl-10">
                      {conversation.lastMessage}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {selectedConv ? (
          <>
            <div className="h-20 border-b border-border flex items-center justify-between px-8 bg-card shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-foreground text-base">
                      {selectedConv.user}
                    </h2>
                    {selectedConv.visitor_ip && (
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border">
                        {selectedConv.visitor_ip}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium capitalize flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live via {selectedConv.channel || "chat"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:bg-muted"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-8">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full border">
                      Conversation Started
                    </span>
                  </div>
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full gap-4",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform hover:scale-105",
                          msg.role === "user" ? "bg-muted border-border" : "bg-primary border-primary"
                        )}
                      >
                        {msg.role === "user" ? (
                          <User className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <div className="w-full h-full relative rounded-xl overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop"
                              alt="Support Agent"
                              width={50}
                              height={50}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-primary rounded-full" />
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex flex-col gap-1.5 max-w-[75%]",
                          msg.role === "user" ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-card border border-border text-foreground rounded-tl-none"
                          )}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground px-2 uppercase tracking-tighter">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-6 border-t border-border bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 bg-muted/30 p-2 rounded-2xl border border-border focus-within:border-primary/30 transition-all shadow-inner">
                  <Input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your reply..."
                    className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground/50 h-12 text-base focus-visible:ring-0 shadow-none font-medium flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyContent.trim() || isSending}
                    className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20"
                    size="icon"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3 px-2">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Press Enter to send
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Agent ID: #772
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/5 p-12 text-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center mb-8 shadow-xl transform hover:rotate-3 transition-transform">
              <MessageSquare className="w-12 h-12 text-primary/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No conversation selected</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
              Select a conversation from the sidebar to view the message history and respond to your customers.
            </p>
            <div className="mt-8 flex gap-2">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-2 h-2 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationPage;
