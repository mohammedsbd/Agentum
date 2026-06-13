import { cookies } from "next/headers";
import Sidebar from "@/components/dashboard/sidebar";

export const metadata = {
  title: "Agentum - Dashboard",
  description:
    "AI-Powered business automation and Customer Support Platform.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const metadataCookie = cookieStore.get("metadata");
  const hasOnboarded = !!metadataCookie?.value;

  return (
    <div className="min-h-screen font-sans antialiased flex bg-background text-foreground">
      {hasOnboarded && <Sidebar />}
      <div
        className={`flex-1 flex flex-col relative min-h-screen transition-all duration-300 ${hasOnboarded ? "md:ml-64" : ""}`}
      >
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
