import type { Metadata } from "next";
import { headers } from "next/headers";
import GioLandingPage from "./GioLandingPage";
import { faqs } from "../src/config/copy";
import { siteConfig } from "../src/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const ogImage = host ? `${protocol}://${host}/og.png` : undefined;

  return {
    title: { absolute: "Estética Avançada | Protocolo de Emagrecimento" },
    description:
      "Conheça o protocolo de emagrecimento: um plano personalizado que conecta cuidado médico, nutrição, psicologia, atividade física e estética na Praia da Costa.",
    keywords: [
      "estética avançada",
      "protocolo de emagrecimento",
      "emagrecimento multidisciplinar",
      "emagrecimento na Praia da Costa",
      "emagrecimento em Vila Velha",
    ],
    openGraph: {
      title: "Estética Avançada | Protocolo de Emagrecimento",
      description:
        "Um plano personalizado de emagrecimento com acompanhamento médico e diferentes áreas de cuidado.",
      type: "website",
      locale: "pt_BR",
      siteName: "Estética Avançada Praia da Costa",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1733, height: 907, alt: "Emagrecimento multidisciplinar e personalizado" }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: "Estética Avançada | Protocolo de Emagrecimento",
      description:
        "Protocolo personalizado com diferentes áreas de cuidado na Praia da Costa.",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.clinicName,
    url: siteConfig.canonicalUrl,
    telephone: "+55 27 99775-6738",
    areaServed: "Praia da Costa, Vila Velha, Espírito Santo",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Henrique Moscoso, 530 - Praia da Costa",
      postalCode: "29100-020",
      addressLocality: "Vila Velha",
      addressRegion: "ES",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "19:00",
      },
    ],
    sameAs: [siteConfig.instagramUrl],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GioLandingPage />
    </>
  );
}
