import { ArrowRight, Send, User, Bot, Sparkles } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/night.png"
          alt="Night City"
          fill
          className="object-cover opacity-40 dark:opacity-20 transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] animate-float pointer-events-none" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-sm text-foreground/80 font-bold tracking-wider uppercase">
            Agentum v1.0
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          AI-Powered Business <br />
          <span className="text-primary">Automation Platform</span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground font-medium mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          A scalable, enterprise-level platform that enables businesses to deploy intelligent, 
          customizable AI agents trained on their own data without technical expertise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Button size="lg" className="h-14 px-10 text-lg rounded-full" asChild>
            <Link href="/api/auth">
              Start for free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full" asChild>
            <Link href="#features">
              Explore features
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating Chat Interface Visualization */}
      <div className="max-w-4xl mx-auto relative z-10 animate-in zoom-in-95 duration-1000">
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 opacity-50 dark:opacity-20" />

        <div className="rounded-3xl p-2 md:p-3 relative overflow-hidden border bg-background/50 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden bg-card/50">
            <div className="h-16 border-b flex items-center justify-between px-8 bg-muted/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-semibold">
                  Agentum AI Assistant
                </span>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-8">
              <div className="flex w-full flex-col items-start">
                <div className="flex max-w-[85%] gap-4 flex-row">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>

                  <div className="space-y-3">
                    <div className="p-5 rounded-2xl text-base leading-relaxed border bg-background shadow-sm rounded-tl-none">
                      Hi there! I'm your custom Agentum assistant. I've been trained on your business data. How can I assist you today?
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Our Features', 'Pricing Plans', 'How to Integrate'].map((tag) => (
                        <span key={tag} className="px-4 py-1.5 rounded-full border bg-muted/50 text-muted-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-end">
                <div className="flex max-w-[85%] gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 border">
                    <User className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="p-5 rounded-2xl text-base leading-relaxed bg-primary text-primary-foreground shadow-lg shadow-primary/10 rounded-tr-none">
                    How do I embed this agent into my website?
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start">
                <div className="flex max-w-[85%] gap-4 flex-row">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="p-5 rounded-2xl text-base leading-relaxed border bg-background shadow-sm rounded-tl-none">
                    It's simple! You just need to copy a single line of SDK script and paste it into your website's header. I can walk you through the process step-by-step.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-muted/20 shrink-0">
              <div className="relative">
                <div className="min-h-[56px] w-full px-6 py-4 text-base bg-background border rounded-2xl text-muted-foreground flex items-center justify-between shadow-inner">
                  <span>Type your question...</span>
                  <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
