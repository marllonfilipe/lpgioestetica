import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mobile personalization enables grid before placing the photo above the copy", async () => {
  const css = await readFile(new URL("../app/responsive.css", import.meta.url), "utf8");
  const mobile = css.slice(css.lastIndexOf("@media (max-width: 680px)"));
  const grid = mobile.match(/body main \.personalization \.personalization-grid\s*\{([^}]+)\}/)?.[1];

  assert.ok(grid, "The mobile personalization layout must be explicitly defined");
  assert.match(grid, /display:\s*grid\s*;/);
  assert.match(grid, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*;/);
  assert.match(grid, /grid-template-areas:\s*"photo"\s*"copy"\s*;/);
  assert.match(mobile, /\.personalization-photo\s*\{\s*grid-area:\s*photo\s*;/);
  assert.match(mobile, /\.personalization-copy\s*\{\s*grid-area:\s*copy\s*;/);
});

async function dispatch(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, init),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function render(path = "/") {
  return dispatch(path, { headers: { accept: "text/html" } });
}

test("server-renders the landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Estética Avançada \| Protocolo de Emagrecimento/i);
  assert.match(html, /Você já tentou fazer dieta, voltar a treinar e mudar sua rotina/i);
  assert.match(html, /foi um plano acompanhando você por inteiro/i);
  assert.match(html, /Não é escolher entre dieta, exercício ou estética/i);
  assert.match(html, /O seu processo não deveria ser igual ao de todo mundo/i);
  assert.match(html, /protocolo-avaliacao\.webp/i);
  assert.match(html, /processo-personalizado\.webp/i);
  assert.match(html, /jornada-acompanhada\.webp/i);
  assert.match(html, /protocolo-para-voce-centralizado\.webp/i);
  assert.match(html, /class="audience-image"><img[^>]+protocolo-para-voce-centralizado\.webp/i);
  assert.doesNotMatch(html, /protocolo-para-voce\.webp/i);
  assert.match(html, /O protocolo completo, em um só investimento/i);
  assert.match(html, /Sob agendamento/i);
  assert.match(html, /Diferentes especialidades, um plano construído em conjunto/i);
  assert.match(html, /Daniel Gomes de Figueiredo/i);
  assert.match(html, /Profissional definido conforme o caso/i);
  assert.match(html, /Thassia Garcia/i);
  assert.match(html, /Responsável pela área de estética/i);
  assert.match(html, /coordena os profissionais que realizam os procedimentos estéticos/i);
  assert.match(html, /thassia-garcia-estetica\.webp/i);
  assert.match(html, /Histórias de quem escolheu cuidar do processo por inteiro/i);
  assert.match(html, /depoimento-resultado-9kg\.jpeg/i);
  assert.match(html, /totalizando 9 kg a menos/i);
  assert.doesNotMatch(html, /Em processo de autorização|O primeiro relato será publicado/i);
  assert.match(html, /Conheça nossa estrutura na Praia da Costa/i);
  assert.match(html, /footer-brand-lockup/i);
  assert.match(html, /aria-label="Estética Avançada Praia da Costa"/i);
  assert.doesNotMatch(html, /Na Gio|Por isso, a Gio|Paciente Gio|Conheça a Gio|Gio Estética Avançada/i);
  assert.doesNotMatch(html, /A experiência Gio|Cuidado percebido em cada detalhe/i);
  assert.match(html, /Entenda o protocolo antes do primeiro contato/i);
  assert.match(html, /aria-label="Navegação principal"/i);
  assert.doesNotMatch(html, /<form\b|Enviar meus dados|id="contato"/i);
  assert.match(html, /wa\.me\/5527992325542/i);
  assert.match(html, /\(27\) 99232-5542/i);
  assert.doesNotMatch(html, /5527997756738|99775-6738/i);
  assert.doesNotMatch(html, /tirzepatida|tratamento medicamentoso|medicação|medicamentos|aplicações/i);
  assert.doesNotMatch(html, /google maps|maps\.app\.goo\.gl/i);
  const whatsappLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/gi)].map((match) =>
    match[1].replaceAll("&amp;", "&"),
  );
  assert.ok(whatsappLinks.length > 0, "A página deve renderizar links para o WhatsApp");
  assert.ok(
    whatsappLinks.every((link) => new URL(link).pathname === "/5527992325542"),
    "Todos os links do WhatsApp devem usar o número novo",
  );
  assert.match(html, /whatsapp-icon/i);
  assert.doesNotMatch(html, /lucide-message-circle/i);
  assert.match(html, /GT-5R8SLSNT/i);
  assert.match(html, /AW-17712476440/i);
  assert.match(html, /Av\. Henrique Moscoso, 530/i);
  assert.doesNotMatch(html, /name="timeTrying"|name="priorTreatment"|name="bestTime"/i);
  assert.match(html, /images\/gio\/hero-1600\.webp/i);
  assert.match(html, /hero-768\.webp 768w/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("rejects invalid lead submissions before contacting the email provider", async () => {
  const response = await dispatch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "A",
      phone: "123",
      difficulty: "",
      consent: false,
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Revise os campos do formulário e tente novamente.",
  });
});

test("blocks cross-origin lead submissions and silently filters honeypot spam", async () => {
  const blockedResponse = await dispatch("/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
    },
    body: JSON.stringify({}),
  });
  assert.equal(blockedResponse.status, 403);

  const spamResponse = await dispatch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Robô de teste",
      phone: "27999999999",
      difficulty: "Teste automatizado",
      consent: true,
      website: "https://spam.example",
    }),
  });
  assert.equal(spamResponse.status, 200);
  assert.deepEqual(await spamResponse.json(), { ok: true });
});

test("server-renders the legal pages", async () => {
  const privacyResponse = await render("/politica-de-privacidade");
  assert.equal(privacyResponse.status, 200);
  assert.match(await privacyResponse.text(), /Política de Privacidade/i);

  const termsResponse = await render("/termos-de-uso");
  assert.equal(termsResponse.status, 200);
  const termsHtml = await termsResponse.text();
  assert.match(termsHtml, /Termos de Uso/i);
  assert.match(termsHtml, /Os resultados podem variar/i);
});
