import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import type { CSSProperties } from "react";
import "./globals.css";

const editorial = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gio Estética Avançada Praia da Costa",
    template: "%s | Gio Praia da Costa",
  },
  description:
    "Protocolo de emagrecimento multidisciplinar e personalizado na Praia da Costa, Vila Velha.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVariables = {
    "--font-editorial": editorial.style.fontFamily,
    "--font-body": body.style.fontFamily,
  } as CSSProperties;

  return (
    <html lang="pt-BR">
      <body className={body.className} style={fontVariables}>
        {children}
      </body>
    </html>
  );
}
