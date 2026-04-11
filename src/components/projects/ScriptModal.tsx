"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ScriptSnippet } from "./ScriptSnippet";
import type { Project } from "@/lib/projects/types";

interface ScriptModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export function ScriptModal({ open, project, onClose }: ScriptModalProps) {
  return (
    <AnimatePresence>
      {open && project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-lg bg-white dark:bg-surface-3 rounded-modal border border-black/[0.06] dark:border-white/[0.06] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div>
                  <h2 className="text-lg font-display font-bold text-ink dark:text-white">
                    Script de instalação
                  </h2>
                  <p className="text-xs text-ghost mt-0.5">
                    {project.name} &middot; {project.domain}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Script */}
              <div className="p-6">
                <ScriptSnippet
                  publicToken={project.public_token}
                  domain={project.domain}
                />

                <div className="mt-5 p-4 rounded-xl bg-jade/5 border border-jade/10">
                  <h5 className="text-sm font-medium text-jade mb-1">
                    Como instalar
                  </h5>
                  <ol className="text-xs text-ghost space-y-1.5 list-decimal list-inside">
                    <li>Copie o código acima</li>
                    <li>
                      Cole antes da tag{" "}
                      <code className="text-jade/70">&lt;/head&gt;</code> do seu
                      HTML
                    </li>
                    <li>
                      Publique as alterações no seu site
                    </li>
                    <li>
                      Acesse seu site e verifique se os dados aparecem no
                      dashboard
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
