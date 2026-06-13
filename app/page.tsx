import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Integration from "@/components/landing/integration";
import Navbar from "@/components/landing/nav";
import Pricing from "@/components/landing/pricing";
import SocialProof from "@/components/landing/social";

const Page = () => {
  return (
    <main className="w-full flex flex-col relative min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden">
      <div className="fixed inset-0 grid-background animate-grid pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_50%)] pointer-events-none" />
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Integration />
      <Pricing />
      <Footer />
    </main>
  );
};

export default Page;
