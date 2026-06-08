import React from "react";
export const dynamic = 'force-dynamic'

const EmbedPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800">
      <style>{`nextjs-portal{display:none!important}body>nextjs-portal{display:none!important}[data-nextjs-dev-indicator]{display:none!important}[data-nextjs-route-type]{display:none!important}`}</style>
      {children}
    </div>
  );
};

export default EmbedPageLayout;
