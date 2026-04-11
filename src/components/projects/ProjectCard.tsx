"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Globe,
  MoreVertical,
  Pencil,
  Trash2,
  Code2,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Project } from "@/lib/projects/types";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onShowScript: (project: Project) => void;
}

const colorPool = [
  "bg-jade",
  "bg-sapphire",
  "bg-gold",
  "bg-ember",
  "bg-jade-dark",
];

function getProjectColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return colorPool[Math.abs(hash) % colorPool.length];
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onShowScript,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = getProjectColor(project.id);
  const isVerified = !!project.script_verified_at;

  return (
    <div className="relative group rounded-xl border bg-white dark:bg-surface-3 border-black/[0.06] dark:border-white/[0.06] p-5 hover:border-jade/30 dark:hover:border-jade/20 transition-all duration-200 hover:shadow-lg hover:shadow-jade/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              color + "/10"
            )}
          >
            <Globe className={cn("w-5 h-5", color.replace("bg-", "text-"))} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink dark:text-white truncate max-w-[200px]">
              {project.name}
            </h3>
            <p className="text-xs text-ghost truncate max-w-[200px]">
              {project.domain}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 py-1.5 rounded-xl border shadow-lg bg-white dark:bg-surface-3 border-black/[0.06] dark:border-white/[0.06] animate-fade-in">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onShowScript(project);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-ink/70 dark:text-ghost hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  Ver script
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-ink/70 dark:text-ghost hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <a
                  href={`https://${project.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-ink/70 dark:text-ghost hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir site
                </a>
                <div className="my-1 border-t border-black/[0.04] dark:border-white/[0.06]" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-ember hover:bg-ember/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-jade" />
              <span className="text-xs text-jade font-medium">Verificado</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs text-gold font-medium">
                Aguardando script
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-ghost">
          {new Date(project.created_at).toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Quick action: show script */}
      {!isVerified && (
        <button
          onClick={() => onShowScript(project)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-jade/30 text-jade text-xs font-medium hover:bg-jade/5 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          Instalar script
        </button>
      )}
    </div>
  );
}
