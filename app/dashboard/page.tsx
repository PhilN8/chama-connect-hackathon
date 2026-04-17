import { Metadata } from "next";
import { DashboardContent } from "@/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | ChamaConnect",
  description: "Manage your chama",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950">
      <DashboardContent />
    </div>
  );
}
