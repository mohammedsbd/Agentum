import { isAuthorized } from "@/lib/isAuthorized";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const user = await isAuthorized();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md border-b bg-background/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 group">
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
          <span className="text-xl font-bold tracking-tight text-foreground">
            Agentum
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            Integration
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/api/auth">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/api/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
