import { Metadata } from "next";
import { DashboardContent } from "@/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | ChamaConnect",
  description: "Manage your chama",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <DashboardContent />
    </div>
  );
}
