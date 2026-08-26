import { siteConfig } from "../../../src/config/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "Estética Avançada Praia da Costa <onboarding@resend.dev>";

type LeadPayload = {
  name?: unknown;
  phone?: unknown;
  difficulty?: unknown;
  consent?: unknown;
  website?: unknown;
};

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function formatPhone(phone: string) {
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== requestUrl.host) {
        return json({ error: "Origem não autorizada." }, 403);
      }
    } catch {
      return json({ error: "Origem não autorizada." }, 403);
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return json({ error: "Solicitação muito grande." }, 413);
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return json({ error: "Dados inválidos." }, 400);
  }

  // Campo invisível: robôs que o preenchem recebem sucesso sem gerar e-mail.
  if (normalizeText(payload.website, 200)) {
    return json({ ok: true });
  }

  const name = normalizeText(payload.name, 100).replace(/[\r\n\t]+/g, " ");
  const phone = normalizeText(payload.phone, 20).replace(/\D/g, "");
  const difficulty = normalizeText(payload.difficulty, 1_500);
  const consent = payload.consent === true;

  if (name.length < 3 || phone.length < 10 || phone.length > 11 || !difficulty || !consent) {
    return json({ error: "Revise os campos do formulário e tente novamente." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY não configurada.");
    return json({ error: "O envio está temporariamente indisponível." }, 503);
  }

  const destinationEmail =
    process.env.LEAD_DESTINATION_EMAIL?.trim() || siteConfig.email;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;

  if (!destinationEmail) {
    console.error("LEAD_DESTINATION_EMAIL não configurado.");
    return json({ error: "O envio está temporariamente indisponível." }, 503);
  }

  const safeName = escapeHtml(name);
  const safeDifficulty = escapeHtml(difficulty).replace(/\n/g, "<br />");
  const displayedPhone = formatPhone(phone);
  const whatsappPhone = `55${phone}`;
  const submittedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  let resendResponse: Response;
  try {
    resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [destinationEmail],
        subject: `Novo contato pelo site — ${name}`,
        text: [
          "Novo contato recebido pelo site de Estética Avançada Praia da Costa",
          "",
          `Nome: ${name}`,
          `WhatsApp: ${displayedPhone}`,
          `Principal dificuldade: ${difficulty}`,
          `Consentimento para contato: Sim`,
          `Recebido em: ${submittedAt}`,
        ].join("\n"),
        html: `
          <div style="background:#f5f0ea;padding:32px;font-family:Arial,sans-serif;color:#3f3046">
            <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
              <div style="background:#594263;padding:24px 28px;color:#ffffff">
                <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.8">Estética Avançada Praia da Costa</div>
                <h1 style="font-size:24px;margin:8px 0 0">Novo contato pelo site</h1>
              </div>
              <div style="padding:28px">
                <p style="margin:0 0 20px">Uma pessoa solicitou contato da equipe.</p>
                <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0;font-weight:bold">Nome</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0;font-weight:bold">WhatsApp</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0">${displayedPhone}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0;font-weight:bold;vertical-align:top">Dificuldade</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee5f0">${safeDifficulty}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-weight:bold">Consentimento</td>
                    <td style="padding:10px 0">Autorizou o contato da equipe</td>
                  </tr>
                </table>
                <a href="https://wa.me/${whatsappPhone}" style="display:inline-block;margin-top:24px;padding:14px 20px;background:#594263;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold">
                  Chamar no WhatsApp
                </a>
                <p style="margin:24px 0 0;color:#786b7e;font-size:12px">Recebido em ${submittedAt}.</p>
              </div>
            </div>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error("Falha de rede ao contatar a Resend.", error);
    return json({ error: "Não foi possível concluir o envio agora." }, 502);
  }

  if (!resendResponse.ok) {
    const resendError = (await resendResponse.json().catch(() => null)) as {
      name?: string;
      message?: string;
    } | null;
    console.error("Resend recusou o envio.", {
      status: resendResponse.status,
      name: resendError?.name ?? "unknown_error",
      message: resendError?.message ?? "Sem detalhes adicionais.",
    });
    return json({ error: "Não foi possível concluir o envio agora." }, 502);
  }

  return json({ ok: true });
}
