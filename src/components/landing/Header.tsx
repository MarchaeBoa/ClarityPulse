"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Produto", href: "#beneficios" },
  { label: "Dashboard", href: "#dashboard-preview" },
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ink/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center group-hover:bg-jade/15 group-hover:border-jade/30 transition-all duration-300">
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
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="relative text-[13px] text-ghost hover:text-white transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-jade group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[13px] text-ghost hover:text-white transition-colors duration-200 px-3 py-1.5"
          >
            Entrar
          </motion.a>
          <motion.a
            href="#pricing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-jade text-ink font-medium text-[13px] hover:bg-jade-hover transition-colors duration-200 shadow-[0_0_20px_rgba(26,229,160,0.15)]"
          >
            Comece grátis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 3.5L9.5 7L5.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-ghost hover:text-white transition-colors p-1 relative z-50"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden bg-ink/98 backdrop-blur-2xl border-t border-white/[0.06] overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-6 pt-4 pb-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="text-[15px] text-ghost hover:text-white transition-colors py-3 border-b border-white/[0.04] last:border-0"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
              <a
                href="#"
                className="text-center text-[14px] text-ghost hover:text-white py-2.5 border border-white/[0.08] rounded-xl transition-colors"
              >
                Entrar
              </a>
              <a
                href="#pricing"
                className="text-center px-4 py-2.5 rounded-xl bg-jade text-ink font-medium text-[14px] hover:bg-jade-hover transition-colors"
              >
                Comece grátis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
