"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Mail,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);
    if (error) {
      setError("Ocorreu um erro. Verifique o email e tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-jade/10 border border-jade/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-jade" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white tracking-display mb-3">
          Email enviado
        </h2>
        <p className="text-ghost leading-relaxed mb-2">
          Se existe uma conta com o email
        </p>
        <p className="text-white font-medium mb-6">{email}</p>
        <p className="text-ghost text-sm leading-relaxed">
          voce recebera um link para redefinir sua senha. Verifique tambem a
          pasta de spam.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-jade hover:text-jade-hover font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-ghost hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-display">
          Recuperar senha
        </h2>
        <p className="mt-2 text-ghost">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-ember/5 border border-ember/10">
          <AlertCircle className="w-5 h-5 text-ember mt-0.5 shrink-0" />
          <p className="text-sm text-ember">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ghost-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-ghost/50 text-sm focus:outline-none focus:ring-2 focus:ring-jade/30 focus:border-jade/30 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-jade text-ink font-semibold text-sm hover:bg-jade-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed jade-glow-button"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de recuperacao"
          )}
        </button>
      </form>
    </div>
  );
}
