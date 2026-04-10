import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard — ClarityPulse",
  description: "Your analytics dashboard. See what matters.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
