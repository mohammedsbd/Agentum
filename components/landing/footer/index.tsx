import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href={"/"} className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Agentum
              </span>
            </Link>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm">
              AI-Powered business automation and Customer Support Platform.
              Empowering businesses with intelligent agents.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">Features</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">Pricing</Link></li>
              <li><Link href="/api/auth" className="text-muted-foreground hover:text-primary transition-colors font-medium">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground font-medium">
          <div className="text-sm">
            © 2026 Agentum AI. All rights reserved.
          </div>
          <div className="flex gap-8 items-center">
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
