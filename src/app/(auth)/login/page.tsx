"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_error: "Erro ao confirmar autenticacao. Tente novamente.",
  verification_failed: "Link de verificacao invalido ou expirado.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-9 w-56 bg-white/[0.04] rounded-lg" />
        <div className="h-5 w-72 bg-white/[0.04] rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-white/[0.04] rounded-xl" />
        <div className="h-12 bg-white/[0.04] rounded-xl" />
        <div className="h-12 bg-jade/20 rounded-xl" />
      </div>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const callbackError = searchParams.get("error");
  const confirmed = searchParams.get("confirmed");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError ? ERROR_MESSAGES[callbackError] ?? "Ocorreu um erro." : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(translateError(error));
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-white tracking-display">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-ghost">
          Entre na sua conta para acessar o dashboard.
        </p>
      </div>

      {/* Success banner */}
      {confirmed && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-jade/5 border border-jade/10">
          <CheckCircle2 className="w-5 h-5 text-jade mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-jade">Email confirmado!</p>
            <p className="text-sm text-ghost mt-0.5">
              Sua conta foi verificada. Faca login para continuar.
            </p>
          </div>
        </div>
      )}

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

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ghost-2">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-jade hover:text-jade-hover transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
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
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-ghost/50 uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-ghost">
        Nao tem uma conta?{" "}
        <Link
          href="/signup"
          className="text-jade hover:text-jade-hover font-medium transition-colors"
        >
          Criar conta gratis
        </Link>
      </p>
    </div>
  );
}

function translateError(error: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos.",
    "Email not confirmed": "Confirme seu email antes de fazer login.",
    "Too many requests": "Muitas tentativas. Aguarde alguns minutos.",
    "User not found": "Nenhuma conta encontrada com este email.",
  };
  return map[error] ?? "Ocorreu um erro. Tente novamente.";
}
