import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Globe,
  Loader2,
  MoreHorizontal,
  Plus,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

const DashboardOverView = () => {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [origin, setOrigin] = useState("");
  const router = useRouter();

  useEffect(() => {
    setOrigin(window.location.origin);

    fetch("/api/overview")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleCopy = () => {
    const code = `<script src="${origin}/widget.js" data-id="${data?.botId}"></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center text-zinc-500 h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { knowledge, sections, chats, counts } = data;

  const setupSteps = [
    { label: "Website Scanned", complete: true, href: "#" },
    {
      label: "Knowledge Added",
      complete: counts.knowledge > 0,
      href: "/dashboard/knowledge",
    },
    {
      label: "Sections Configured",
      complete: counts.sections > 0,
      href: "/dashboard/sections",
    },
    {
      label: "Widget Installed",
      complete: counts.conversations > 0,
      href: "#widget",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Setup Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {setupSteps.map((step, i) => (
            <Link key={i} href={step.href} className="block group">
              <Card
                className={cn(
                  "border-border bg-card hover:bg-muted transition-colors shadow-sm",
                  step.complete
                    ? "opacity-60"
                    : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                )}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      step.complete ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.complete ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-foreground">
                Knowledge Base
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-9 font-bold border-border hover:bg-muted"
                asChild
              >
                <Link href="/dashboard/knowledge">Manage sources</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Pages
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-foreground">
                  {knowledge.website || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Texts
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-foreground">
                  {knowledge.text || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-card border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Uploads
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-foreground">
                  {knowledge.upload || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm min-h-90">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground">
                  Sections
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  Configure behavior for different topics
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="h-10 gap-2 font-bold rounded-lg px-4"
                asChild
              >
                <Link href="/dashboard/sections">
                  <Plus className="w-4 h-4" />
                  Create Section
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {sections.list.length === 0 ? (
                  <div className="p-12 text-center text-base text-muted-foreground font-medium">
                    No sections configured yet.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 bg-muted/50 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-3">Sources</div>
                      <div className="col-span-3">Tone</div>
                      <div className="col-span-1"></div>
                    </div>
                    {sections?.list.map((section: any, i: number) => (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-muted transition-colors last:border-0 group"
                      >
                        <div className="col-span-5 text-base font-bold text-foreground">
                          {section.name}
                        </div>
                        <div className="col-span-3 text-sm font-medium text-muted-foreground">
                          {section.sourceCount} sources
                        </div>
                        <div className="col-span-3">
                          <Badge
                            variant="secondary"
                            className="bg-muted text-foreground hover:bg-muted/80 rounded-md font-bold"
                          >
                            {section.tone}
                          </Badge>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/dashboard/sections")}
                            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border bg-card shadow-sm min-h-80">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">
                  Recent Chats
                </CardTitle>
                <Link
                  href="/dashboard/conversations"
                  className="text-sm font-bold text-primary hover:underline transition-all flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-4">
              <div className="space-y-2">
                {chats.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground font-medium">
                    No chats yet.
                  </div>
                ) : (
                  chats.map((chat: any, i: number) => (
                    <Link
                      key={i}
                      href="/dashboard/conversations"
                      className="block p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted transition-all group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {chat.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                        {chat.snippet}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm" id="widget">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                Install Widget
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Add this snippet to your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <pre className="bg-muted p-5 rounded-xl text-xs overflow-x-auto border border-border">
                  <code className="text-[11px] text-foreground font-mono font-bold block overflow-x-auto whitespace-pre">
                    {`<script src="${origin}/widget.js" \n  data-id="${
                      data?.botId || "..."
                    }" \n  defer>\n</script>`}
                  </code>
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 bg-background shadow-sm border-border"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverView;
