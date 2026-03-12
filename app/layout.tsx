import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { ClientChrome } from "./_components/ClientChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "High-performance portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={[
          inter.variable,
          display.variable,
          "min-h-dvh bg-neutral-950 text-neutral-100 antialiased",
          "selection:bg-lime-400 selection:text-neutral-950",
          "cursor-none",
        ].join(" ")}
      >
        <ClientChrome>{children}</ClientChrome>
      </body>
    </html>
  );
}

