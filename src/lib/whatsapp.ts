import { siteConfig } from "../config/site";

export function buildWhatsAppUrl(message = siteConfig.whatsappMessage) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildLeadMessage(data: {
  name: string;
  difficulty: string;
}) {
  return [
    `Olá! Meu nome é ${data.name}.`,
    "Gostaria de saber mais sobre o protocolo de emagrecimento multidisciplinar da Gio.",
    `Minha principal dificuldade é: ${data.difficulty}`,
    "Quero entender se o protocolo é indicado para mim e quais são os próximos passos.",
  ].join("\n");
}
