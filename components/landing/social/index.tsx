import React from "react";

const SocialProof = () => {
  return (
    <section className="py-16 border-y bg-muted/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-12">
          Trusted by innovative companies worldwide
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black tracking-tighter">
            ACME CORP
          </span>
          <span className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 bg-foreground rounded-full"></div> GLOBE
          </span>
          <span className="text-2xl font-bold tracking-widest">
            BOLT
          </span>
          <span className="text-2xl font-extrabold italic">
            Vantage
          </span>
          <span className="text-2xl font-medium tracking-[0.3em]">
            ZENITH
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
