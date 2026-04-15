"use client";

import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

const footerLinks = {
  Produto: [
    { label: "Dashboard", href: "#dashboard-preview" },
    { label: "IA Insights", href: "#" },
    { label: "Eventos & Conversoes", href: "#eventos" },
    { label: "Relatorios", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Recursos: [
    { label: "Documentacao", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Guia de migracao GA4", href: "#" },
    { label: "Status", href: "#" },
    { label: "Comunidade", href: "#" },
  ],
  Empresa: [
    { label: "Sobre", href: "#" },
    { label: "Contato", href: "#" },
    { label: "Trabalhe conosco", href: "#" },
    { label: "Imprensa", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de uso", href: "#" },
    { label: "DPA", href: "#" },
    { label: "Cookies (nenhum!)", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "LGPD", href: "#" },
  ],
};

const socialLinks = [
  {
    label: "Twitter",
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  },
  {
    label: "GitHub",
    path: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
  },
  {
    label: "LinkedIn",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z",
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-10 border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main grid */}
        <Stagger
          slow
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16"
        >
          {/* Brand column */}
          <MotionItem className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
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
            <p className="text-[12px] text-ghost leading-relaxed mb-5 max-w-[200px]">
              Web analytics que seus visitantes confiam e seu time precisa.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-ghost hover:text-white hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-200"
                  aria-label={social.label}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </MotionItem>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <MotionItem key={title}>
              <h4 className="text-[10px] font-mono font-medium text-ghost/40 uppercase tracking-[0.15em] mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-ghost hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </MotionItem>
          ))}
        </Stagger>

        {/* Bottom bar */}
        <Reveal>
          <div className="flex flex-col gap-4 pt-8 border-t border-white/[0.04]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[11px] font-mono text-ghost/30">
                &copy; {new Date().getFullYear()} ClarityPulse. Todos os
                direitos reservados.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                  <span className="text-[10px] font-mono text-ghost/30">
                    Todos os sistemas operacionais
                  </span>
                </div>
                <span className="text-[10px] font-mono text-ghost/20">|</span>
                <span className="text-[10px] font-mono text-ghost/30">
                  Hospedado na EU
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] font-mono text-ghost/40">
              <p>
                ClarityPulse e um produto{" "}
                <span className="text-ghost/60">Soutag Brasil</span>{" "}
                &middot; Soutag Tecnologia Brasil LTDA
              </p>
              <p>CNPJ: 50.892.860/0001-55</p>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
