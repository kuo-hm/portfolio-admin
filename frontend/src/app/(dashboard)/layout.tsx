import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-7xl h-full">{children}</div>
      </main>
    </div>
  );
}
