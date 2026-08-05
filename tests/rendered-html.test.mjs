import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
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

test("server-renders the Gio landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Emagrecimento Multidisciplinar \| Gio Praia da Costa/i);
  assert.match(html, /Emagrecimento com/i);
  assert.match(html, /uma equipe cuidando de você por inteiro/i);
  assert.match(html, /Seis frentes de acompanhamento/i);
  assert.match(html, /Tire suas dúvidas sobre o protocolo/i);
  assert.match(html, /Descubra se o protocolo é indicado para você/i);
  assert.match(html, /aria-label="Navegação principal"/i);
  assert.match(html, /name="consent"/i);
  assert.match(html, /wa\.me\/5527997756738/i);
  assert.match(html, /Av\. Henrique Moscoso, 530/i);
  assert.doesNotMatch(html, /name="timeTrying"|name="priorTreatment"|name="bestTime"/i);
  assert.match(html, /images\/gio\/hero\.png/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
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
