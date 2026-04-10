"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Palette,
  FileText,
  Download,
  Plus,
  Eye,
  Settings,
  Clock,
  Check,
  ChevronDown,
  Sparkles,
  Mail,
  Copy,
  Crown,
} from "lucide-react";
import {
  getDefaultBrand,
  getDefaultSections,
  getReportTemplates,
  getGeneratedReports,
  generateReport,
  type BrandConfig,
  type ReportSection,
  type ReportConfig,
  type ReportSectionData,
} from "@/lib/reports/white-label";

export default function WhiteLabelPage() {
  const [tab, setTab] = useState<"generator" | "history" | "brand">("generator");
  const templates = getReportTemplates();
  const pastReports = getGeneratedReports();
  const [brand, setBrand] = useState<BrandConfig>(getDefaultBrand());
  const [sections, setSections] = useState<ReportSection[]>(getDefaultSections());
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [previewReport, setPreviewReport] = useState<ReturnType<typeof generateReport> | null>(null);

  const handleGenerate = () => {
    const config: ReportConfig = {
      ...selectedTemplate,
      brand,
      sections,
    };
    const report = generateReport(config);
    setPreviewReport(report);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-jade" />
            Relatórios White-Label
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-gold/20 to-ember/20 text-gold">
              <Crown className="w-3 h-3 inline mr-0.5" />
              Premium
            </span>
          </h1>
          <p className="text-sm text-ghost mt-1">
            Gere relatórios com a marca do seu cliente ou agência.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-mist dark:bg-white/[0.04] w-fit">
        {[
          { id: "generator" as const, label: "Gerar Relatório" },
          { id: "brand" as const, label: "Branding" },
          { id: "history" as const, label: "Histórico" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
              tab === t.id
                ? "bg-white dark:bg-surface shadow-sm text-ink dark:text-white"
                : "text-ghost hover:text-ink dark:hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config panel */}
          <div className="space-y-4">
            {/* Template selection */}
            <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">Template</h3>
              <div className="space-y-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-all",
                      selectedTemplate.id === tpl.id
                        ? "border-jade/30 bg-jade/[0.04]"
                        : "border-black/[0.04] dark:border-white/[0.04] hover:border-black/[0.08]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {selectedTemplate.id === tpl.id && <Check className="w-3.5 h-3.5 text-jade" />}
                      <p className="text-xs font-semibold text-ink dark:text-white">{tpl.name}</p>
                    </div>
                    <p className="text-[10px] text-ghost mt-0.5">
                      {tpl.sections.length} seções • {tpl.template} • {tpl.format.toUpperCase()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">Seções do Relatório</h3>
              <div className="space-y-1.5">
                {sections.map((section) => (
                  <label
                    key={section.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-mist/50 dark:hover:bg-white/[0.02] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => {
                        setSections(
                          sections.map((s) =>
                            s.id === section.id ? { ...s, enabled: !s.enabled } : s
                          )
                        );
                      }}
                      className="w-3.5 h-3.5 rounded border-ghost/30 text-jade focus:ring-jade/20"
                    />
                    <span className="text-xs text-ink dark:text-white">{section.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-hover transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Relatório
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            {previewReport ? (
              <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] overflow-hidden">
                {/* Report header */}
                <div
                  className="p-6 border-b border-black/[0.04] dark:border-white/[0.04]"
                  style={{ borderTop: `4px solid ${brand.primaryColor}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ghost">{previewReport.config.clientName}</p>
                      <h2 className="text-lg font-display font-bold text-ink dark:text-white">
                        {previewReport.config.name}
                      </h2>
                      <p className="text-xs text-ghost mt-0.5">{previewReport.config.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: brand.primaryColor }}>
                        {brand.companyName}
                      </p>
                      <p className="text-[10px] text-ghost">{brand.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Report sections */}
                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {previewReport.sections.map((section, i) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5"
                    >
                      <h3 className="text-sm font-bold text-ink dark:text-white mb-2" style={{ color: brand.primaryColor }}>
                        {section.title}
                      </h3>
                      <p className="text-xs text-ghost leading-relaxed mb-3">{section.content}</p>

                      {section.metrics && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {section.metrics.map((m) => (
                            <div key={m.label} className="p-2.5 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                              <p className="text-[9px] text-ghost">{m.label}</p>
                              <p className="text-xs font-bold text-ink dark:text-white">{m.value}</p>
                              {m.change !== undefined && (
                                <p className={cn("text-[9px] font-semibold", m.change > 0 ? "text-jade" : "text-ember")}>
                                  {m.change > 0 ? "+" : ""}{m.change}%
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {section.tableData && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                                {Object.keys(section.tableData[0]).map((key) => (
                                  <th key={key} className="text-left py-1.5 px-2 text-[10px] font-semibold text-ghost">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableData.map((row, j) => (
                                <tr key={j} className="border-b border-black/[0.02] dark:border-white/[0.02]">
                                  {Object.values(row).map((val, k) => (
                                    <td key={k} className="py-1.5 px-2 text-ghost">
                                      {String(val)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-black/[0.04] dark:border-white/[0.04] bg-mist/30 dark:bg-white/[0.01] flex items-center justify-between">
                  <div className="text-[10px] text-ghost">
                    {brand.showPoweredBy ? "Powered by ClarityPulse" : brand.companyName} • {brand.contactEmail}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] text-xs text-ghost hover:text-ink dark:hover:text-white transition-colors">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] text-xs text-ghost hover:text-ink dark:hover:text-white transition-colors">
                      <Mail className="w-3 h-3" /> Email
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] text-xs text-ghost hover:text-ink dark:hover:text-white transition-colors">
                      <Copy className="w-3 h-3" /> Link
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-black/[0.06] dark:border-white/[0.06] p-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-ghost/30 mb-3" />
                <p className="text-sm font-semibold text-ghost">Nenhum relatório gerado</p>
                <p className="text-xs text-ghost/60 mt-1">
                  Selecione um template e clique em "Gerar Relatório"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "brand" && (
        <div className="max-w-xl space-y-4">
          <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-ink dark:text-white">Configurações de Marca</h3>

            {[
              { label: "Nome da Empresa", key: "companyName" as const, type: "text" },
              { label: "Tagline", key: "tagline" as const, type: "text" },
              { label: "Email de Contato", key: "contactEmail" as const, type: "email" },
              { label: "Website", key: "website" as const, type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-ghost block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={brand[field.key]}
                  onChange={(e) => setBrand({ ...brand, [field.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-surface text-sm text-ink dark:text-white"
                />
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Cor Primária", key: "primaryColor" as const },
                { label: "Cor Secundária", key: "secondaryColor" as const },
                { label: "Cor de Destaque", key: "accentColor" as const },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-ghost block mb-1">{field.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand[field.key]}
                      onChange={(e) => setBrand({ ...brand, [field.key]: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                    />
                    <span className="text-xs text-ghost font-mono">{brand[field.key]}</span>
                  </div>
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-lg bg-mist/50 dark:bg-white/[0.02] cursor-pointer">
              <input
                type="checkbox"
                checked={!brand.showPoweredBy}
                onChange={() => setBrand({ ...brand, showPoweredBy: !brand.showPoweredBy })}
                className="w-3.5 h-3.5 rounded border-ghost/30 text-jade focus:ring-jade/20"
              />
              <div>
                <p className="text-xs font-medium text-ink dark:text-white">Remover "Powered by ClarityPulse"</p>
                <p className="text-[10px] text-ghost">Exibir apenas a marca da sua agência nos relatórios.</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                {["Relatório", "Cliente", "Data", "Formato", "Template", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold text-ghost uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pastReports.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-black/[0.02] dark:border-white/[0.02] hover:bg-mist/30 dark:hover:bg-white/[0.01]"
                >
                  <td className="py-3 px-4 text-xs font-medium text-ink dark:text-white">{report.name}</td>
                  <td className="py-3 px-4 text-xs text-ghost">{report.client}</td>
                  <td className="py-3 px-4 text-xs text-ghost">{report.date}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full text-ghost">
                      {report.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-ghost">{report.template}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-mist dark:hover:bg-white/[0.04] text-ghost hover:text-ink dark:hover:text-white transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-mist dark:hover:bg-white/[0.04] text-ghost hover:text-ink dark:hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
