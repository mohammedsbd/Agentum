import React from "react";
import { CheckCircle2 } from "lucide-react";

const Integration = () => {
  const steps = [
    {
      title: "Ingest Knowledge",
      description: "Point us to your docs or upload files.",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    },
    {
      title: "Copy Embed Code",
      description: "Get your unique SDK script tag.",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    },
    {
      title: "Go Live",
      description: "AI agents start handling requests instantly.",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-y bg-muted/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            Drop-in <span className="text-primary">Simplicity</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
            Integrate Agentum into any platform in minutes. Our lightweight SDK 
            handles the heavy lifting, inheriting your site's styles automatically.
          </p>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">{step.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <div className="rounded-3xl border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <span className="text-sm font-mono font-medium text-muted-foreground">
                index.html
              </span>
            </div>

            <div className="p-8 font-mono text-sm md:text-base leading-relaxed bg-background/50">
              <div className="text-muted-foreground/60 mb-2">
                &lt;!-- Agentum AI Integration --&gt;
              </div>
              <div className="text-foreground">
                &lt;<span className="text-primary font-bold">script</span>
              </div>
              <div className="pl-6 mt-1">
                <span className="text-primary/80">src</span>=
                <span className="text-emerald-500 font-medium">
                  &quot;https://agentum.ai/sdk/widget.js&quot;
                </span>
              </div>
              <div className="pl-6 mt-1">
                <span className="text-primary/80">data-agent-id</span>=
                <span className="text-emerald-500 font-medium">
                  &quot;ag_82f1x9283k4l...&quot;
                </span>
              </div>
              <div className="pl-6 mt-1 font-bold">
                defer&gt;
              </div>
              <div className="text-foreground mt-1">
                &lt;/<span className="text-primary font-bold">script</span>&gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
