"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Produto", href: "#beneficios" },
  { label: "Integrações", href: "#integracoes" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center group-hover:bg-jade/15 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L14.5 4.75V12.25L8 16L1.5 12.25V4.75L8 1Z"
                stroke="#1AE5A0"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="8.5" r="2" fill="#1AE5A0" />
            </svg>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight text-white">
            ClarityPulse
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] text-ghost hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-[13px] text-ghost hover:text-white transition-colors duration-200 px-3 py-1.5"
          >
            Entrar
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jade text-ink font-medium text-[13px] hover:bg-jade-hover transition-all duration-200 active:scale-[0.97]"
          >
            Comece grátis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 3.5L9.5 7L5.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-ghost hover:text-white transition-colors p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-xl border-t border-white/[0.06] px-6 pb-6 pt-4">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] text-ghost hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="text-center text-[13px] text-ghost hover:text-white py-2 border border-white/[0.08] rounded-lg transition-colors"
            >
              Entrar
            </a>
            <a
              href="#pricing"
              className="text-center px-4 py-2.5 rounded-lg bg-jade text-ink font-medium text-[13px] hover:bg-jade-hover transition-colors"
            >
              Comece grátis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
