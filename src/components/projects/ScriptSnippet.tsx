"use client";

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptSnippetProps {
  publicToken: string;
  domain: string;
}

export function ScriptSnippet({ publicToken, domain }: ScriptSnippetProps) {
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://app.claritypulse.io";

  const script = `<script>
  (function() {
    var d = document, s = d.createElement('script');
    s.async = true;
    s.defer = true;
    s.dataset.token = '${publicToken}';
    s.dataset.api = '${origin}/api/collect';
    s.src = '${origin}/cp.js';
    d.head.appendChild(s);
  })();
</script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = script;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Code2 className="w-4 h-4 text-jade" />
        <h4 className="text-sm font-medium text-ink dark:text-white">
          Script de instalação
        </h4>
      </div>
      <p className="text-xs text-ghost">
        Cole este código antes do <code className="text-jade/80">&lt;/head&gt;</code> do
        seu site <strong className="text-ink dark:text-white">{domain}</strong>:
      </p>
      <div className="relative group">
        <pre className="p-4 rounded-xl bg-ink dark:bg-surface-3 text-[13px] leading-relaxed text-green-300 font-mono overflow-x-auto border border-black/10 dark:border-white/[0.06]">
          <code>{script}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
            copied
              ? "bg-jade/20 text-jade"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
