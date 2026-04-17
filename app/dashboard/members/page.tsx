import type { Metadata } from "next";
import { DashboardMembersTable } from "@/components/dashboard-members-table";

export const metadata: Metadata = {
  title: "Members | ChamaConnect Dashboard",
  description: "Manage your chama members",
};

export default function DashboardMembersPage() {
  return <DashboardMembersTable />;
}
