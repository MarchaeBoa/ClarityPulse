"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Globe, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectModal } from "@/components/projects/AddProjectModal";
import { EditProjectModal } from "@/components/projects/EditProjectModal";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { ScriptModal } from "@/components/projects/ScriptModal";

export default function SitesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [scriptProject, setScriptProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleCreate(data: { name: string; domain: string }) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao criar site");
    }

    const newProject = await res.json();
    setProjects((prev) => [newProject, ...prev]);
    setAddOpen(false);

    // Automatically show script modal
    setScriptProject(newProject);
  }

  async function handleEdit(
    id: string,
    data: { name: string; domain: string }
  ) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao atualizar site");
    }

    const updated = await res.json();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
    setEditProject(null);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao excluir site");
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteProject(null);
  }

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-32 rounded-lg bg-mist-2 dark:bg-white/[0.04] animate-shimmer" />
            <div className="h-4 w-56 rounded-lg bg-mist-2 dark:bg-white/[0.04] animate-shimmer mt-2" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-mist-2 dark:bg-white/[0.04] animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-mist-2 dark:bg-white/[0.04] animate-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white">
            Meus Sites
          </h1>
          <p className="text-sm text-ghost mt-1">
            Gerencie os sites conectados ao ClarityPulse.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jade hover:bg-jade-hover text-white text-sm font-medium transition-colors shadow-lg shadow-jade/20"
        >
          <Plus className="w-4 h-4" />
          Adicionar site
        </button>
      </div>

      {/* Search bar (only show when there are projects) */}
      {projects.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sites..."
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all duration-200",
              "bg-white dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06]",
              "text-ink dark:text-white placeholder:text-ghost",
              "focus:outline-none focus:ring-2 focus:ring-jade/20 focus:border-jade/30"
            )}
          />
        </div>
      )}

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-jade/10 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-jade" />
          </div>
          <h3 className="text-lg font-display font-bold text-ink dark:text-white mb-2">
            Nenhum site cadastrado
          </h3>
          <p className="text-sm text-ghost text-center max-w-sm mb-6">
            Adicione seu primeiro site para começar a rastrear visitantes e obter
            insights com o ClarityPulse.
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-jade hover:bg-jade-hover text-white text-sm font-medium transition-colors shadow-lg shadow-jade/20"
          >
            <Plus className="w-4 h-4" />
            Adicionar primeiro site
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-10 h-10 text-ghost/40 mb-3" />
          <p className="text-sm text-ghost">
            Nenhum site encontrado para &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditProject}
              onDelete={setDeleteProject}
              onShowScript={setScriptProject}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddProjectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
      />

      <EditProjectModal
        open={!!editProject}
        project={editProject}
        onClose={() => setEditProject(null)}
        onSubmit={handleEdit}
      />

      <DeleteProjectDialog
        open={!!deleteProject}
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
      />

      <ScriptModal
        open={!!scriptProject}
        project={scriptProject}
        onClose={() => setScriptProject(null)}
      />
    </div>
  );
}
