import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Script from "next/script";
import type { CSSProperties } from "react";
import { siteConfig } from "../src/config/site";
import "./globals.css";
import "./responsive.css";

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
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: {
    default: "Estética Avançada | Protocolo de Emagrecimento",
    template: "%s | Estética Avançada Praia da Costa",
  },
  description:
    "Protocolo de emagrecimento personalizado com acompanhamento médico e diferentes áreas de cuidado na Praia da Costa, Vila Velha.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
        {siteConfig.googleTagId ? (
          <>
            <Script id="google-tag-bootstrap" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${siteConfig.googleTagId}');gtag('config','${siteConfig.googleAdsId}');`}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleTagId}`}
              strategy="afterInteractive"
            />
          </>
        ) : siteConfig.googleTagManagerId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${siteConfig.googleTagManagerId}');`}
          </Script>
        ) : siteConfig.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${siteConfig.googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
        {siteConfig.metaPixelId ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${siteConfig.metaPixelId}');fbq('track','PageView');`}
          </Script>
        ) : null}
        {children}
      </body>
    </html>
  );
}
