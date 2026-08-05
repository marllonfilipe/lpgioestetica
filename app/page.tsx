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
        dayOfWeek: ["Monday", "Wednesday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Thursday"],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
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
