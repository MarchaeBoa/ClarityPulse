"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects/types";

interface EditProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSubmit: (id: string, data: { name: string; domain: string }) => Promise<void>;
}

export function EditProjectModal({
  open,
  project,
  onClose,
  onSubmit,
}: EditProjectModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDomain(project.domain);
      setError("");
    }
  }, [project]);

  function handleClose() {
    if (loading) return;
    setError("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setError("");

    const trimmedName = name.trim();
    const trimmedDomain = domain.trim();

    if (!trimmedName) {
      setError("O nome do site é obrigatório.");
      return;
    }
    if (!trimmedDomain) {
      setError("O domínio é obrigatório.");
      return;
    }

    const cleanDomain = trimmedDomain
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(cleanDomain)) {
      setError("Domínio inválido. Ex: meusite.com.br");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(project.id, { name: trimmedName, domain: cleanDomain });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar projeto."
      );
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
            <div className="w-full max-w-md bg-white dark:bg-surface-3 rounded-modal border border-black/[0.06] dark:border-white/[0.06] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sapphire/10 flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-sapphire" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-ink dark:text-white">
                      Editar site
                    </h2>
                    <p className="text-xs text-ghost mt-0.5">
                      Atualize as informações do site
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-ember/10 border border-ember/20">
                    <AlertCircle className="w-4 h-4 text-ember mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-ember">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink dark:text-white">
                    Nome do site
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Meu Site"
                    disabled={loading}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200",
                      "bg-mist dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06]",
                      "text-ink dark:text-white placeholder:text-ghost",
                      "focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire/50",
                      "disabled:opacity-50"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink dark:text-white">
                    Domínio
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="meusite.com.br"
                    disabled={loading}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200",
                      "bg-mist dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06]",
                      "text-ink dark:text-white placeholder:text-ghost",
                      "focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire/50",
                      "disabled:opacity-50"
                    )}
                  />
                  <p className="text-[11px] text-ghost">
                    Sem http:// ou https://. Ex: meusite.com.br
                  </p>
                </div>

                {/* ID (read-only) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ghost">
                    ID do projeto
                  </label>
                  <div className="px-4 py-2.5 rounded-xl bg-mist/50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-xs text-ghost font-mono select-all">
                    {project.id}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06] text-sm font-medium text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sapphire hover:bg-sapphire/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
