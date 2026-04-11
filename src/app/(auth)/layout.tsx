"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-ink">
          {/* Background effects */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-jade/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sapphire/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-jade/10 border border-jade/20 flex items-center justify-center group-hover:bg-jade/15 transition-colors">
                <Activity className="w-5 h-5 text-jade" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-display">
                ClarityPulse
              </span>
            </Link>

            {/* Tagline */}
            <div className="max-w-md">
              <h1 className="font-display text-4xl font-bold text-white tracking-display leading-tight mb-4">
                Analytics que{" "}
                <span className="gradient-text-jade">respeita</span> seus
                usuarios
              </h1>
              <p className="text-ghost text-lg leading-relaxed">
                Insights poderosos com inteligencia artificial. Sem cookies,
                100% GDPR compliant, setup em 2 minutos.
              </p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6">
                {[
                  { value: "4.8kb", label: "Script size" },
                  { value: "100%", label: "GDPR/LGPD" },
                  { value: "<50ms", label: "Latencia" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-2xl font-bold text-jade">
                      {stat.value}
                    </div>
                    <div className="text-sm text-ghost mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-ghost/40 text-sm">
              &copy; {new Date().getFullYear()} ClarityPulse. Privacy-first
              analytics.
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ink lg:bg-surface">
          {/* Mobile logo */}
          <div className="absolute top-6 left-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-jade" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-display">
                ClarityPulse
              </span>
            </Link>
          </div>

          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
