import { cookies } from "next/headers";
import Sidebar from "@/components/dashboard/sidebar";

export const metadata = {
  title: "OneMinute Support - Dashboard",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy.",
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
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800 flex">
      {hasOnboarded && <Sidebar />}
      <div
        className={`flex-1 flex flex-col relative min-h-screen transition-all duration-300 ${hasOnboarded ? "md:ml-64" : ""}`}
      >
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
