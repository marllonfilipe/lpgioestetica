import { siteConfig } from "../config/site";

export function buildWhatsAppUrl(message = siteConfig.whatsappMessage) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildLeadMessage(data: {
  name: string;
  timeTrying: string;
  difficulty: string;
  priorTreatment: string;
  bestTime: string;
}) {
  return [
    `Olá! Meu nome é ${data.name}.`,
    "Gostaria de saber mais sobre o protocolo de emagrecimento multidisciplinar da Gio.",
    `Tento emagrecer há: ${data.timeTrying}`,
    `Minha principal dificuldade é: ${data.difficulty}`,
    `Já realizei tratamento anteriormente: ${data.priorTreatment}`,
    `Melhor horário para contato: ${data.bestTime}`,
  ].join("\n");
}
