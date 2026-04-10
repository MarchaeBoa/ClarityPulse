"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  Smartphone,
  Globe,
  Clock,
} from "lucide-react";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    icon: TrendingUp,
    label: "Maior crescimento",
    prompt: "Qual foi minha página com maior crescimento essa semana?",
    color: "text-jade",
    bg: "bg-jade/[0.08]",
  },
  {
    icon: Users,
    label: "Conversões por origem",
    prompt: "De onde vieram meus usuários que mais converteram?",
    color: "text-sapphire",
    bg: "bg-sapphire/[0.08]",
  },
  {
    icon: Target,
    label: "Pior campanha",
    prompt: "Qual campanha teve pior desempenho?",
    color: "text-ember",
    bg: "bg-ember/[0.08]",
  },
  {
    icon: BarChart3,
    label: "Resumo do tráfego",
    prompt: "Resuma meu tráfego dos últimos 30 dias",
    color: "text-sapphire",
    bg: "bg-sapphire/[0.08]",
  },
  {
    icon: Lightbulb,
    label: "Ações práticas",
    prompt: "Me diga 5 ações práticas para aumentar conversões",
    color: "text-gold",
    bg: "bg-gold/[0.08]",
  },
  {
    icon: Smartphone,
    label: "Desktop vs Mobile",
    prompt: "Compare desktop vs mobile este mês",
    color: "text-jade",
    bg: "bg-jade/[0.08]",
  },
  {
    icon: Globe,
    label: "Fontes de tráfego",
    prompt: "Quais são minhas top 5 fontes de tráfego?",
    color: "text-sapphire",
    bg: "bg-sapphire/[0.08]",
  },
  {
    icon: Clock,
    label: "Horários de pico",
    prompt: "Qual horário tem mais acessos?",
    color: "text-gold",
    bg: "bg-gold/[0.08]",
  },
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {suggestions.map((s, i) => (
        <motion.button
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          onClick={() => onSelect(s.prompt)}
          className="group flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 border-black/[0.04] dark:border-white/[0.04] hover:border-black/[0.08] dark:hover:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-mist/50 dark:hover:bg-white/[0.04]"
        >
          <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink dark:text-white mb-0.5 truncate">
              {s.label}
            </p>
            <p className="text-[11px] text-ghost leading-snug line-clamp-2">
              {s.prompt}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
