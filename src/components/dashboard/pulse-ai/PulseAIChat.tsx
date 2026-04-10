"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  RotateCcw,
  Activity,
} from "lucide-react";
import { PromptSuggestions } from "./PromptSuggestions";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { AIResponseSection } from "@/lib/pulse-ai/engine";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sections?: AIResponseSection[];
  timestamp: string;
}

function formatTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PulseAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: formatTime(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/pulse-ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok) {
          throw new Error("API request failed");
        }

        const data = await res.json();

        const assistantMessage: Message = {
          id: data.id ?? crypto.randomUUID(),
          role: "assistant",
          content: "",
          sections: data.response?.sections,
          timestamp: formatTime(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Desculpe, houve um erro ao processar sua pergunta. Por favor, tente novamente.",
          timestamp: formatTime(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jade/20 to-sapphire/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-jade" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white">
              Pulse AI
            </h1>
            <p className="text-xs text-ghost mt-0.5">
              Converse com seus dados em linguagem natural
            </p>
          </div>
        </div>
        {!isEmpty && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
              "border border-black/[0.06] dark:border-white/[0.06]",
              "text-ghost hover:text-ink dark:hover:text-white hover:bg-mist/50 dark:hover:bg-white/[0.04]"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Nova conversa
          </motion.button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 rounded-xl border bg-mist/30 dark:bg-white/[0.01] border-black/[0.04] dark:border-white/[0.04] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {/* Empty state */}
          {isEmpty && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg mx-auto mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-jade/20 via-sapphire/10 to-jade/5 flex items-center justify-center mx-auto mb-5">
                  <Activity className="w-7 h-7 text-jade" />
                </div>
                <h2 className="text-lg font-display font-bold text-ink dark:text-white mb-2">
                  Pergunte qualquer coisa sobre seus dados
                </h2>
                <p className="text-sm text-ghost leading-relaxed">
                  O Pulse AI analisa seus dados analíticos em tempo real e
                  responde com insights acionáveis. Experimente uma das
                  sugestões abaixo ou escreva sua própria pergunta.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full max-w-3xl mx-auto"
              >
                <p className="text-[11px] font-medium uppercase tracking-widest text-ghost/50 mb-3 text-center">
                  Sugestões populares
                </p>
                <PromptSuggestions onSelect={sendMessage} />
              </motion.div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              sections={msg.sections}
              timestamp={msg.timestamp}
              isLatest={i === messages.length - 1}
            />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-surface/50 p-3 md:p-4 flex-shrink-0">
          {!isEmpty && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
            >
              {[
                "Resuma meu tráfego",
                "Top páginas",
                "Ações para melhorar",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="flex-shrink-0 px-3 py-1.5 text-[11px] font-medium rounded-full border border-black/[0.04] dark:border-white/[0.04] text-ghost hover:text-ink dark:hover:text-white hover:bg-mist/50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte algo sobre seus dados..."
                rows={1}
                disabled={isLoading}
                className={cn(
                  "w-full resize-none rounded-xl border px-4 py-3 pr-12 text-[13px] leading-relaxed",
                  "bg-mist/50 dark:bg-white/[0.03]",
                  "border-black/[0.06] dark:border-white/[0.06]",
                  "focus:border-jade/30 dark:focus:border-jade/30 focus:ring-2 focus:ring-jade/10",
                  "text-ink dark:text-white placeholder:text-ghost/60",
                  "outline-none transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "max-h-32 scrollbar-thin"
                )}
                style={{
                  height: "auto",
                  minHeight: "44px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-jade text-ink hover:bg-jade-hover shadow-sm"
                  : "bg-mist dark:bg-white/[0.04] text-ghost cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-ghost/40 mt-2 text-center">
            Pulse AI analisa dados do seu workspace. Respostas baseadas em dados
            reais dos últimos 30 dias.
          </p>
        </div>
      </div>
    </div>
  );
}
