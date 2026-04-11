"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";

const PASSWORD_RULES = [
  { label: "Minimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiuscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Um numero", test: (p: string) => /\d/.test(p) },
];

export default function SignUpPage() {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(password));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allRulesPass) {
      setError("A senha nao atende aos requisitos minimos.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(translateError(error));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-jade/10 border border-jade/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-jade" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white tracking-display mb-3">
          Verifique seu email
        </h2>
        <p className="text-ghost leading-relaxed mb-2">
          Enviamos um link de confirmacao para
        </p>
        <p className="text-white font-medium mb-6">{email}</p>
        <p className="text-ghost text-sm leading-relaxed">
          Clique no link enviado para ativar sua conta. Se nao encontrar,
          verifique a pasta de spam.
        </p>
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <p className="text-sm text-ghost">
            Ja confirmou?{" "}
            <Link
              href="/login?confirmed=1"
              className="text-jade hover:text-jade-hover font-medium transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-display">
          Crie sua conta
        </h2>
        <p className="mt-2 text-ghost">
          Comece gratuitamente. Sem cartao de credito.
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
        {/* Full name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-ghost-2">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-ghost/50 text-sm focus:outline-none focus:ring-2 focus:ring-jade/30 focus:border-jade/30 transition-all"
            />
          </div>
        </div>

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

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-ghost-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-ghost/50 text-sm focus:outline-none focus:ring-2 focus:ring-jade/30 focus:border-jade/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ghost hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              {PASSWORD_RULES.map((rule) => {
                const passes = rule.test(password);
                return (
                  <div
                    key={rule.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        passes
                          ? "bg-jade/20 text-jade"
                          : "bg-white/[0.04] text-ghost/40"
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span
                      className={passes ? "text-ghost-2" : "text-ghost/50"}
                    >
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !allRulesPass}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-jade text-ink font-semibold text-sm hover:bg-jade-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed jade-glow-button"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta gratis"
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-ghost/50 text-center leading-relaxed">
          Ao criar sua conta, voce concorda com os{" "}
          <span className="text-ghost underline underline-offset-2">
            Termos de Servico
          </span>{" "}
          e{" "}
          <span className="text-ghost underline underline-offset-2">
            Politica de Privacidade
          </span>
          .
        </p>
      </form>

      {/* Divider */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-ghost/50 uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-ghost">
        Ja tem uma conta?{" "}
        <Link
          href="/login"
          className="text-jade hover:text-jade-hover font-medium transition-colors"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
}

function translateError(error: string): string {
  const map: Record<string, string> = {
    "User already registered": "Este email ja esta cadastrado.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
    "Too many requests": "Muitas tentativas. Aguarde alguns minutos.",
    "Unable to validate email address: invalid format":
      "Formato de email invalido.",
  };
  return map[error] ?? "Ocorreu um erro. Tente novamente.";
}
