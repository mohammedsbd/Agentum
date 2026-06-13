import { Check, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for individuals and small projects.",
      features: [
        "100 conversations / mo",
        "1 Knowledge Source",
        "Community Support",
        "Standard AI Agent",
        "Web Widget Integration",
      ],
      cta: "Start for free",
      variant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$49",
      description: "Advanced features for growing businesses.",
      features: [
        "Unlimited conversations",
        "Unlimited Knowledge Sources",
        "Priority Email Support",
        "Advanced AI Models",
        "Custom Branding & SDK",
        "Detailed Analytics",
      ],
      cta: "Get Started",
      variant: "default" as const,
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">
          Simple, <span className="text-primary">Transparent</span> Pricing
        </h2>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Choose the plan that's right for your business. All plans include our core AI features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative flex flex-col border-2 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-muted'} bg-card/50 backdrop-blur-sm`}>
            {plan.popular && (
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
            )}
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground font-medium">/mo</span>
              </div>
              <CardDescription className="text-lg">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-foreground/80 font-medium">
                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button className="w-full h-12 text-lg font-bold rounded-xl" variant={plan.variant} asChild>
                <Link href="/api/auth">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
