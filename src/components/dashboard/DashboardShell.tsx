"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <div className="min-h-screen bg-mist dark:bg-ink text-ink dark:text-white transition-colors duration-200">
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              collapsed={sidebarCollapsed}
              onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div
              className={cn(
                "transition-all duration-300 ease-out",
                sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[252px]"
              )}
            >
              <Topbar onMenuClick={() => setSidebarOpen(true)} />

              <main className="p-4 md:p-6 max-w-[1440px]">{children}</main>
            </div>
          </div>
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
