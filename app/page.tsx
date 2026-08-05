import type { Metadata } from "next";
import { headers } from "next/headers";
import GioLandingPage from "./GioLandingPage";
import { faqs } from "../src/config/copy";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const ogImage = host ? `${protocol}://${host}/og.png` : undefined;

  return {
    title: { absolute: "Emagrecimento Multidisciplinar | Gio Praia da Costa" },
    description:
      "Conheça o protocolo de emagrecimento da Gio Praia da Costa com acompanhamento médico, psicológico, nutricional, estético, plano com educador físico e tirzepatida mediante indicação médica.",
    openGraph: {
      title: "Emagrecimento Multidisciplinar | Gio Praia da Costa",
      description:
        "Uma equipe cuidando da sua saúde, alimentação, comportamento, atividade física e evolução corporal em conjunto.",
      type: "website",
      locale: "pt_BR",
      siteName: "Gio Estética Avançada Praia da Costa",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1733, height: 907, alt: "Gio - Emagrecimento multidisciplinar e personalizado" }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: "Emagrecimento Multidisciplinar | Gio Praia da Costa",
      description:
        "Protocolo personalizado com acompanhamento multidisciplinar na Praia da Costa.",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Gio Estética Avançada Praia da Costa",
    areaServed: "Praia da Costa, Vila Velha, Espírito Santo",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vila Velha",
      addressRegion: "ES",
      addressCountry: "BR",
    },
    sameAs: ["https://www.instagram.com/giopraiadacosta/"],
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
