import { BookOpen, ShieldCheck, MessageCircleHeart, Zap, Layout, BarChart3 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Knowledge Ingestion",
      description: "Automatically crawl your website, documents, and custom inputs to build a comprehensive knowledge base.",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Strict Guardrails",
      description: "Define exactly what the AI can and cannot say, ensuring accurate and context-aware responses every time.",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Brand Voice",
      description: "Customize the AI's personality and tone to match your brand's unique identity perfectly.",
      icon: MessageCircleHeart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Instant Deployment",
      description: "Embed your AI agent into any website with a simple SDK snippet. No technical expertise required.",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Custom SDK",
      description: "A lightweight, customizable widget that blends seamlessly with your existing website design.",
      icon: Layout,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Deep Analytics",
      description: "Track performance, user interactions, and satisfaction metrics with our built-in analytics dashboard.",
      icon: BarChart3,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">
          Powerful Features for <span className="text-primary">Modern Business</span>
        </h2>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Agentum provides everything you need to deploy intelligent AI assistants 
          grounded in your own business data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="group border-none shadow-none bg-muted/30 hover:bg-muted/50 transition-all duration-300">
            <CardHeader>
              <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
