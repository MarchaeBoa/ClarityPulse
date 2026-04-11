"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  AlertCircle,
  Check,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const PASSWORD_RULES = [
  { label: "Minimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiuscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Um numero", test: (p: string) => /\d/.test(p) },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-jade/10 border border-jade/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-jade" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white tracking-display mb-3">
          Senha redefinida!
        </h2>
        <p className="text-ghost leading-relaxed">
          Sua senha foi alterada com sucesso. Redirecionando para o dashboard...
        </p>
        <div className="mt-6">
          <Loader2 className="w-5 h-5 text-jade animate-spin mx-auto" />
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
        Voltar para login
      </Link>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-display">
          Nova senha
        </h2>
        <p className="mt-2 text-ghost">
          Escolha uma nova senha segura para sua conta.
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
        {/* New password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-ghost-2">
            Nova senha
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

        {/* Confirm password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ghost-2">
            Confirmar nova senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-ghost/50 text-sm focus:outline-none focus:ring-2 focus:ring-jade/30 focus:border-jade/30 transition-all"
            />
          </div>
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="text-xs text-ember mt-1">As senhas nao coincidem.</p>
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
              Redefinindo...
            </>
          ) : (
            "Redefinir senha"
          )}
        </button>
      </form>
    </div>
  );
}
