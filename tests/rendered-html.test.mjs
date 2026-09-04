import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import postcss from "postcss";

test("button finishes retain accessible contrast, touch behavior and keyboard focus", async () => {
  const css = await readFile(new URL("../app/ui-polish.css", import.meta.url), "utf8");
  const theme = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  postcss.parse(css);
  const token = (name) => theme.match(new RegExp(`${name}:\\s*(#[a-f0-9]{6})`, "i"))?.[1];
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const [ink, fill] of [["--cta-ink", "--cta-top"], ["--cta-ink", "--cta-bottom"], ["--cta-soft-ink", "--cta-soft"]]) {
    const levels = [luminance(token(ink)), luminance(token(fill))].sort((a, b) => a - b);
    assert.ok((levels[1] + 0.05) / (levels[0] + 0.05) >= 4.5, `${ink} on ${fill} must remain readable`);
  }
  const finishes = css.slice(css.indexOf("/* Button finishes:"));
  assert.match(finishes, /\.button\.button-outline/);
  assert.match(finishes, /\.button:is\(\.button-beige, \.button-light\)/);
  assert.match(finishes, /:focus-visible/);
  assert.match(finishes, /:active/);
  assert.match(finishes, /@media \(hover: none\)/);
  assert.match(finishes, /\.mobile-fixed-cta \{ border-radius: 0; \}/);
  assert.doesNotMatch(finishes, /url\(|backdrop-filter|filter:\s*blur/);
});

test("sections do not wait for scroll-linked animations and images can revalidate", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const hosting = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");
  assert.doesNotMatch(css, /animation-timeline:\s*view\(\)/);
  const imageHeaders = hosting.split('for = "/images/*"')[1];
  assert.ok(imageHeaders);
  assert.match(imageHeaders, /public, max-age=0, must-revalidate/);
  assert.doesNotMatch(imageHeaders, /no-store|immutable/);
  assert.doesNotMatch(hosting, /for = "\/\*"/, "A blanket no-store rule must not override asset caching");
  assert.match(hosting, /no-cache, no-store, must-revalidate/, "HTML must still receive updates immediately");
});

test("responsive portraits preserve framing while reducing transfer and decode size", async () => {
  const { default: sharp } = await import("sharp");
  const original = await readFile(new URL("../public/images/gio/thassia-garcia-estetica.webp", import.meta.url));
  const originalMetadata = await sharp(original).metadata();
  for (const width of [640, 960, 1365]) {
    const photo = await readFile(new URL(`../public/images/gio/thassia-garcia-${width}-v1.webp`, import.meta.url));
    const metadata = await sharp(photo).metadata();
    assert.equal(metadata.width, width);
    assert.ok(Math.abs(metadata.width / metadata.height - originalMetadata.width / originalMetadata.height) < 0.001);
    assert.ok(photo.length < original.length / 3, "Every rendition must be at least 66% smaller");
    assert.ok(metadata.width * metadata.height < originalMetadata.width * originalMetadata.height / 6);
  }
});

test("UI polish keeps photo cropping mobile-only and prioritizes photos", async () => {
  const css = postcss.parse(await readFile(new URL("../app/ui-polish.css", import.meta.url), "utf8"));
  const mobile = css.nodes.find((node) => node.type === "atrule" && node.params === "(max-width: 680px)");
  assert.ok(mobile);
  const rules = [];
  css.walkRules((rule) => rules.push(rule));
  for (const selector of [".identification-image > img", ".personalization-photo > img", ".transformation-photo > img"]) {
    const crop = rules.find((rule) => rule.selector.includes(selector));
    assert.ok(crop, selector);
    assert.equal(crop.parent, mobile, "Desktop must retain its original framing");
    const values = Object.fromEntries(crop.nodes.map((node) => [node.prop, node.value]));
    assert.equal(values.width, "170%");
    assert.equal(values.height, "auto", "Preserve the source image proportions");
    assert.equal(values.inset, "0 0 auto auto");
  }
  const mobileCss = mobile.toString();
  assert.match(mobileCss, /grid-template-areas: "photo" "copy"/);
  assert.match(mobileCss, /\.identification-image\s*\{ order: -1;/);
  assert.match(mobileCss, /\.process-thumbnails\s*\{ order: -1;/);
  assert.match(mobileCss, /\.team-area-card-profile > img\s*\{\s*position: static;/);
  assert.match(mobileCss, /safe-area-inset-bottom/);
});

test("motion is optional and navigation and expandable controls remain accessible", async () => {
  const css = await readFile(new URL("../app/ui-polish.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../app/GioLandingPage.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.ok(layout.indexOf('import "./ui-polish.css"') > layout.indexOf('import "./responsive.css"'));
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /opacity:\s*0\s*;/, "Content must never depend on animation to become visible");
  assert.match(source, /aria-current=\{activeSection === item.href \? "location" : undefined\}/);
  assert.match(source, /event.key !== "Escape"/);
  assert.match(source, /observer.unobserve\(entry.target\)/);
  assert.match(source, /!menuOpen && !contextualActionsVisible && !heroActionsVisible/);
});

test("mobile hero fills its photo layer and centers both women", async () => {
  const css = await readFile(new URL("../app/responsive.css", import.meta.url), "utf8");
  const mobile = css.slice(css.lastIndexOf("@media (max-width: 680px)"));
  const hero = mobile.match(/body main > \.hero\.section-pad::before\s*\{([^}]+)\}/)?.[1];

  assert.ok(hero, "Hero framing must be scoped to mobile");
  assert.match(hero, /display:\s*block\s*;/);
  assert.match(hero, /inset:\s*72px 0 auto\s*;/);
  assert.match(hero, /width:\s*100%\s*;/);
  assert.match(hero, /height:\s*260px\s*;/);
  assert.match(hero, /background-size:\s*100% 100%,\s*185% auto\s*;/);
  assert.match(hero, /background-position:\s*center,\s*98% 35%\s*;/);
});

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
  assert.match(html, /<link[^>]+rel="preload"[^>]+as="image"[^>]+href="\/images\/gio\/hero-1600\.webp"[^>]+fetchPriority="high"/i);
  const hiddenHero = html.match(/<img[^>]+alt="Profissional acolhendo uma paciente em ambiente premium"[^>]*>/i)?.[0];
  assert.match(hiddenHero ?? "", /loading="lazy"/i);
  assert.doesNotMatch(hiddenHero ?? "", /fetchPriority="high"/i);
  assert.match(html, /thassia-garcia-640-v1\.webp 640w/);
  assert.match(html, /thassia-garcia-1365-v1\.webp 1365w/);
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
