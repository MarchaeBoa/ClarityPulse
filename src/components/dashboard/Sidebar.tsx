"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  MousePointerClick,
  Globe,
  Target,
  Sparkles,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  Activity,
  Tag,
  Link2,
  X,
  MessageSquareText,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapse: () => void;
}

const navSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Real-time", href: "/dashboard/realtime", icon: Activity },
    ],
  },
  {
    label: "Analytics",
    items: [
      { name: "Traffic", href: "/dashboard/traffic", icon: BarChart3 },
      { name: "Audience", href: "/dashboard/audience", icon: Users },
      { name: "Pages", href: "/dashboard/pages", icon: FileText },
      { name: "Geography", href: "/dashboard/geo", icon: Globe },
      { name: "UTMs", href: "/dashboard/utm", icon: Tag },
      { name: "Referrals", href: "/dashboard/referrals", icon: Link2 },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Events", href: "/dashboard/events", icon: MousePointerClick },
      { name: "Goals", href: "/dashboard/goals", icon: Target },
      { name: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
      { name: "Pulse AI", href: "/dashboard/pulse-ai", icon: MessageSquareText },
    ],
  },
];

const bottomItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Docs", href: "/dashboard/help", icon: HelpCircle },
];

export function Sidebar({ open, onClose, collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  const content = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-black/[0.04] dark:border-white/[0.06] flex-shrink-0",
          !isMobile && collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-jade/10 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-jade" />
        </div>
        {(isMobile || !collapsed) && (
          <span className="font-display font-bold text-[15px] tracking-tight text-ink dark:text-white">
            ClarityPulse
          </span>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto text-ghost hover:text-ink dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.label}>
            {(isMobile || !collapsed) && (
              <p className="text-[11px] font-medium uppercase tracking-widest text-ghost/50 dark:text-ghost/40 px-2.5 mb-2">
                {section.label}
              </p>
            )}
            {!isMobile && collapsed && (
              <div className="w-6 h-px bg-black/[0.04] dark:bg-white/[0.06] mx-auto mb-2" />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const isCollapsedDesktop = !isMobile && collapsed;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      title={isCollapsedDesktop ? item.name : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-150",
                        isCollapsedDesktop
                          ? "justify-center p-2.5"
                          : "px-2.5 py-[7px]",
                        isActive
                          ? "bg-jade/[0.08] text-jade dark:text-jade"
                          : "text-ink/50 dark:text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId={isMobile ? "sidebar-mobile-active" : "sidebar-active"}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-jade rounded-r-full"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {!isCollapsedDesktop && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-black/[0.04] dark:border-white/[0.06] p-3 space-y-0.5 flex-shrink-0">
        {bottomItems.map((item) => {
          const isCollapsedDesktop = !isMobile && collapsed;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsedDesktop ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors",
                "text-ink/50 dark:text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]",
                isCollapsedDesktop ? "justify-center p-2.5" : "px-2.5 py-[7px]"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {!isCollapsedDesktop && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen hidden lg:flex flex-col border-r transition-all duration-300 ease-out",
          "bg-white/80 dark:bg-surface/80 backdrop-blur-xl border-black/[0.06] dark:border-white/[0.06]",
          collapsed ? "w-[68px]" : "w-[252px]"
        )}
      >
        {content(false)}

        {/* Collapse toggle */}
        <button
          onClick={onCollapse}
          className={cn(
            "absolute -right-3 top-20 z-50 w-6 h-6 rounded-full border flex items-center justify-center",
            "transition-all duration-200",
            "bg-white dark:bg-surface-3 border-black/[0.08] dark:border-white/[0.08]",
            "hover:bg-mist dark:hover:bg-white/10 text-ghost hover:text-ink dark:hover:text-white",
            "shadow-sm"
          )}
        >
          <ChevronLeft
            className={cn(
              "w-3 h-3 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-white dark:bg-surface border-r border-black/[0.06] dark:border-white/[0.06] lg:hidden shadow-2xl"
            >
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
