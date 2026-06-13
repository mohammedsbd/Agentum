"use client";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Bot,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Sections", href: "/dashboard/sections", icon: Layers },
  { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
  {
    label: "Conversations",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { email } = useUser();
  const [metadata, setMetadata] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await fetch("/api/metadata/fetch");
      const res = await response.json();
      setMetadata(res.data);
      setIsLoading(false);
    };
    fetchMetadata();
  }, []);

  return (
    <aside className="w-64 border-r bg-card flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <Link href={"/"} className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Agentum
          </span>
        </Link>
        <ModeToggle />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile / Bottom Area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group border bg-muted/30">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-inner">
            <span className="text-xs font-bold text-primary-foreground">
              {metadata?.business_name?.slice(0, 2).toUpperCase() || ".."}
            </span>
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate">
              {isLoading
                ? "Loading..."
                : metadata?.business_name}
            </span>
            <span className="text-xs text-muted-foreground truncate">{email}</span>
          </div>
          <a
            href="/api/auth/logout"
            className="ml-auto p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
