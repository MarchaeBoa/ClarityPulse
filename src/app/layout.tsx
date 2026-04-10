import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ClarityPulse — Web Analytics que respeita seus usuários",
  description:
    "Analytics privacy-first com inteligência artificial. Sem cookies, 100% GDPR compliant, script de 4.8kb. Dados reais, insights automáticos, setup em 2 minutos.",
  keywords: [
    "web analytics",
    "privacy-first analytics",
    "GDPR compliant",
    "cookieless analytics",
    "AI insights",
    "Google Analytics alternative",
    "analytics sem cookies",
    "LGPD compliant",
  ],
  openGraph: {
    title: "ClarityPulse — Web Analytics que respeita seus usuários",
    description:
      "Analytics privacy-first com IA. Sem cookies, GDPR compliant, 10x mais leve que Google Analytics.",
    type: "website",
    siteName: "ClarityPulse",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClarityPulse — Analytics privacy-first com IA",
    description:
      "Sem cookies, GDPR compliant, script de 4.8kb. Veja o que importa, não o que é permitido.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-ink text-white antialiased noise-overlay overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
