import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClarityPulse — Web Analytics that respects your users",
  description:
    "Privacy-first web analytics with AI-powered insights. No cookies, fully GDPR compliant, and 10x faster than Google Analytics. See what matters, not what's allowed.",
  keywords: [
    "web analytics",
    "privacy-first analytics",
    "GDPR compliant",
    "cookieless analytics",
    "AI insights",
    "Google Analytics alternative",
  ],
  openGraph: {
    title: "ClarityPulse — Web Analytics that respects your users",
    description:
      "Privacy-first web analytics with AI-powered insights. No cookies, fully GDPR compliant.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
