"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Project } from "@/lib/projects/types";

interface DeleteProjectDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteProjectDialog({
  open,
  project,
  onClose,
  onConfirm,
}: DeleteProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    if (loading) return;
    setError("");
    onClose();
  }

  async function handleConfirm() {
    if (!project) return;
    setError("");
    setLoading(true);
    try {
      await onConfirm(project.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div className="w-full max-w-sm bg-white dark:bg-surface-3 rounded-modal border border-black/[0.06] dark:border-white/[0.06] shadow-2xl p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-ember/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-ember" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-display font-bold text-ink dark:text-white mb-2">
                  Excluir site
                </h3>
                <p className="text-sm text-ghost">
                  Tem certeza que deseja excluir{" "}
                  <strong className="text-ink dark:text-white">
                    {project.name}
                  </strong>
                  ? Todos os dados de analytics serão perdidos permanentemente.
                </p>
                {error && (
                  <p className="mt-3 text-sm text-ember">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06] text-sm font-medium text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ember hover:bg-ember/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Excluir site"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
