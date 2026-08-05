"use client";

import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Syringe,
  UsersRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  audienceItems,
  cycleSteps,
  emotionalBenefits,
  faqs,
  identificationItems,
  medicalNotice,
  navigation,
  objections,
  personalizationItems,
  processSteps,
  protocolCards,
  sixFronts,
  teamRoles,
} from "../src/config/copy";
import { pendingInformation, siteConfig } from "../src/config/site";
import { trackEvent } from "../src/lib/analytics";
import { buildLeadMessage, buildWhatsAppUrl } from "../src/lib/whatsapp";

const protocolIcons = {
  medical: HeartPulse,
  nutrition: Apple,
  psychology: Brain,
  movement: Dumbbell,
  aesthetics: Sparkles,
  tirzepatide: Syringe,
};

const galleryImages = [
  ["/images/gio/hero.png", "Acolhimento em ambiente premium na Gio"],
  ["/images/gio/identificacao.png", "Momento cotidiano de escolha e autocuidado"],
  ["/images/gio/protocolo.png", "Atendimento personalizado em ambiente elegante"],
  ["/images/gio/para-quem-e.png", "Profissional e paciente analisando um plano"],
] as const;

type FormErrors = Partial<
  Record<"name" | "phone" | "timeTrying" | "difficulty" | "priorTreatment" | "bestTime" | "consent", string>
>;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function GioLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [heroActionsVisible, setHeroActionsVisible] = useState(true);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const formSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!formSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(formSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const heroActions = document.querySelector(".hero");
    if (!heroActions) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroActionsVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(heroActions);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seen.has(entry.target.id)) return;
          seen.add(entry.target.id);
          trackEvent("section_view", { section: entry.target.id });
        });
      },
      { threshold: 0.35 },
    );
    ["protocolo", "equipe", "duvidas"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const whatsappHref = buildWhatsAppUrl();

  function handleWhatsAppClick(location: string) {
    trackEvent("whatsapp_click", { location });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").replace(/\D/g, ""),
      timeTrying: String(form.get("timeTrying") ?? "").trim(),
      difficulty: String(form.get("difficulty") ?? "").trim(),
      priorTreatment: String(form.get("priorTreatment") ?? "").trim(),
      bestTime: String(form.get("bestTime") ?? "").trim(),
      consent: form.get("consent") === "on",
    };

    const nextErrors: FormErrors = {};
    if (values.name.length < 3) nextErrors.name = "Informe seu nome completo.";
    if (values.phone.length < 10) nextErrors.phone = "Informe um WhatsApp válido com DDD.";
    if (!values.timeTrying) nextErrors.timeTrying = "Selecione uma opção.";
    if (!values.difficulty) nextErrors.difficulty = "Conte brevemente sua principal dificuldade.";
    if (!values.priorTreatment) nextErrors.priorTreatment = "Selecione uma opção.";
    if (!values.bestTime) nextErrors.bestTime = "Selecione o melhor horário.";
    if (!values.consent) nextErrors.consent = "Você precisa autorizar o contato da equipe.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        formElement.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    trackEvent("lead_form_submit", { location: "lead_form" });
    const message = buildLeadMessage(values);
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner shell">
          <a className="brand" href="#hero" aria-label="Gio Estética Avançada - início">
            <span className="brand-mark">Gio.</span>
            <span className="brand-line">Estética Avançada</span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="button button-small header-cta"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleWhatsAppClick("header")}
          >
            Falar com a equipe
            <ArrowUpRight aria-hidden="true" />
          </a>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <nav aria-label="Navegação mobile">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
                <ArrowRight aria-hidden="true" />
              </a>
            ))}
            <a
              className="button"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setMenuOpen(false);
                handleWhatsAppClick("mobile_menu");
              }}
            >
              Falar com a equipe
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section id="hero" className="hero section-pad">
          <div className="shell hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow">Emagrecimento multidisciplinar e personalizado</div>
              <p className="section-index">Praia da Costa · Vila Velha</p>
              <h1>
                Você já tentou emagrecer de várias formas. O que talvez tenha faltado não foi esforço - foi{" "}
                <em>uma equipe cuidando de tudo ao mesmo tempo.</em>
              </h1>
              <p className="hero-lead">
                Um protocolo personalizado que reúne acompanhamento médico, psicológico, nutricional,
                estético, plano com educador físico e aplicação de tirzepatida em uma única jornada.
              </p>
              <p className="hero-support">
                Na Gio Praia da Costa, diferentes profissionais acompanham sua saúde, alimentação,
                comportamento, atividade física e evolução corporal durante o processo.
              </p>
              <div className="button-row">
                <a
                  className="button"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleWhatsAppClick("hero")}
                >
                  Quero saber se é para mim
                  <ArrowRight aria-hidden="true" />
                </a>
                <a
                  className="button button-outline"
                  href="#protocolo"
                  onClick={() => trackEvent("secondary_cta_click", { location: "hero" })}
                >
                  Conhecer o protocolo
                </a>
              </div>
              <div className="hero-indicators" aria-label="Diferenciais">
                {["Avaliação individual", "Equipe multidisciplinar", "Acompanhamento próximo"].map((item) => (
                  <span key={item}>
                    <Check aria-hidden="true" /> {item}
                  </span>
                ))}
              </div>
              <p className="medical-note">
                <ShieldCheck aria-hidden="true" /> O protocolo é definido individualmente. A tirzepatida
                depende de avaliação, indicação, prescrição e acompanhamento médico.
              </p>
            </div>

            <div className="hero-visual reveal delay-1">
              <div className="image-frame hero-image-frame">
                <img
                  src="/images/gio/hero.png"
                  width="2048"
                  height="1152"
                  alt="Profissional acolhendo uma paciente em ambiente premium da Gio"
                  fetchPriority="high"
                />
              </div>
              <div className="floating-card floating-card-top">
                <UsersRound aria-hidden="true" />
                <span>Acompanhamento multidisciplinar</span>
              </div>
              <div className="floating-card floating-card-bottom">
                <ClipboardList aria-hidden="true" />
                <span>Plano pensado para a sua realidade</span>
              </div>
              <span className="photo-index">01</span>
              <span className="photo-caption">Cuidado completo</span>
            </div>
          </div>
        </section>

        <section className="fronts-band" aria-label="As seis frentes do protocolo">
          <div className="shell fronts-grid">
            {sixFronts.map(([title, text]) => (
              <div key={title} className="front-item">
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="identificacao" className="identification section-pad">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <span className="kicker">Quando a rotina pesa</span>
                <h2>Talvez você se reconheça em algumas dessas situações</h2>
              </div>
              <p>
                Não é sobre falta de vontade. É sobre tentar sustentar sozinho um processo que envolve corpo,
                mente, rotina e saúde.
              </p>
            </div>

            <div className="identification-layout">
              <div className="identification-image image-frame">
                <img
                  src="/images/gio/identificacao.png"
                  width="2048"
                  height="1152"
                  alt="Pessoa escolhendo uma roupa em uma situação cotidiana"
                  loading="lazy"
                />
                <span className="image-note">“Sente que sempre precisa começar novamente.”</span>
              </div>
              <div className="statement-grid">
                {identificationItems.map((item, index) => (
                  <article key={item} className={`statement statement-${index + 1}`}>
                    <span>0{index + 1}</span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="editorial-callout">
              <p>
                Talvez o problema não seja falta de força de vontade. Talvez você esteja tentando resolver
                sozinho um processo que precisa ser acompanhado por diferentes profissionais.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("identificacao")}
              >
                Quero conhecer esse acompanhamento <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="cycle section-pad">
          <div className="shell cycle-grid">
            <div className="cycle-visual" aria-label="Ciclo das tentativas">
              <span className="cycle-orbit" aria-hidden="true" />
              {cycleSteps.map((step, index) => (
                <div className={`cycle-step cycle-step-${index + 1}`} key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </div>
              ))}
              <p className="cycle-center">O ciclo<br />recomeça</p>
            </div>
            <div className="cycle-copy">
              <span className="kicker">Quebra de culpa</span>
              <h2>O ciclo não começa na falta de esforço</h2>
              <p>
                Você começa motivado, organiza a alimentação, tenta encaixar exercícios e percebe alguma
                evolução. Mas, quando a rotina aperta, manter tantas mudanças sozinho pode se tornar difícil.
              </p>
              <blockquote>
                Talvez o que esteja falhando não seja você. Talvez sejam as tentativas de cuidar de um processo
                complexo por meio de soluções isoladas.
              </blockquote>
              <p>
                Foi pensando em pessoas que vivem essa luta há anos que a Gio estruturou um protocolo
                multidisciplinar e personalizado.
              </p>
            </div>
          </div>
        </section>

        <section id="protocolo" className="protocol section-pad">
          <div className="shell">
            <div className="protocol-intro">
              <div>
                <span className="kicker">O protocolo</span>
                <h2>Seis frentes de acompanhamento. <em>Uma única jornada.</em></h2>
                <p>Cada profissional acompanha uma parte do que pode estar dificultando sua evolução.</p>
              </div>
              <div className="protocol-photo image-frame">
                <img
                  src="/images/gio/protocolo.png"
                  width="1152"
                  height="1440"
                  alt="Profissional em ambiente premium apresentando o protocolo"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="protocol-bento">
              {protocolCards.map((card) => {
                const Icon = protocolIcons[card.key as keyof typeof protocolIcons];
                return (
                  <article key={card.key} className={`protocol-card protocol-${card.key}`}>
                    <div className="protocol-card-top">
                      <Icon aria-hidden="true" />
                      <span>{card.number}</span>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="protocol-footer">
              <p>Você não recebe apenas uma aplicação. Você recebe uma equipe inteira acompanhando o processo.</p>
              <a
                className="button button-light"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("protocolo")}
              >
                Quero iniciar minha avaliação <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="contrast section-pad">
          <div className="shell">
            <div className="section-heading centered-narrow">
              <span className="kicker">Integração</span>
              <h2>Não é escolher entre dieta, exercício, estética ou medicação</h2>
              <p>É entender como cada parte pode contribuir para o seu processo.</p>
            </div>
            <div className="contrast-grid">
              <article className="contrast-isolated">
                <span className="contrast-label">Quando tudo acontece de forma isolada</span>
                {["Dieta sem suporte emocional", "Treino incompatível com a rotina", "Medicação sem acompanhamento dos hábitos", "Orientações desconectadas"].map((item) => (
                  <p key={item}><span aria-hidden="true" />{item}</p>
                ))}
              </article>
              <article className="contrast-integrated">
                <span className="contrast-label">Quando cada parte trabalha em conjunto</span>
                {["Saúde acompanhada pelo médico", "Alimentação orientada", "Emoções acompanhadas", "Atividade física planejada", "Tirzepatida dentro de estratégia médica"].map((item) => (
                  <p key={item}><Check aria-hidden="true" />{item}</p>
                ))}
              </article>
            </div>
            <p className="contrast-conclusion">
              O seu processo não depende de uma única decisão. Depende de um plano em que todas as partes
              conversem entre si.
            </p>
          </div>
        </section>

        <section id="para-quem-e" className="audience section-pad">
          <div className="shell audience-grid">
            <div className="audience-photo image-frame">
              <img
                src="/images/gio/para-quem-e.png"
                width="2048"
                height="1152"
                alt="Pessoa adulta em atendimento, com aparência real, elegante e confiante"
                loading="lazy"
              />
              <div className="audience-overlap">
                Não é para quem procura mais uma solução genérica. É para quem deseja ser acompanhado de perto.
              </div>
            </div>
            <div className="audience-copy">
              <span className="kicker">Para quem é</span>
              <h2>Este protocolo foi pensado para você que</h2>
              <ul className="editorial-list">
                {audienceItems.map((item) => (
                  <li key={item}><span aria-hidden="true">✦</span>{item}</li>
                ))}
              </ul>
              <a
                className="button"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("para_quem_e")}
              >
                Quero saber se é para mim <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="personalization section-pad">
          <div className="shell personalization-grid">
            <div className="personalization-copy">
              <span className="kicker">Personalização</span>
              <h2>O seu processo não deveria ser igual ao de todo mundo</h2>
              <p className="large-copy">
                Cada pessoa possui um histórico. Cada corpo responde de uma maneira. Cada rotina apresenta
                dificuldades específicas.
              </p>
              <p>
                Por isso, o protocolo não começa com uma solução pronta. Ele começa com uma avaliação.
              </p>
              <div className="personalization-list">
                {personalizationItems.map((item) => (
                  <span key={item}><Check aria-hidden="true" />{item}</span>
                ))}
              </div>
              <blockquote>
                Você não precisa se encaixar em um método genérico. O acompanhamento precisa fazer sentido para
                a sua realidade.
              </blockquote>
            </div>
            <div className="personalization-photo image-frame">
              <img
                src="/images/gio/para-quem-e.png"
                width="2048"
                height="1152"
                alt="Profissional e paciente analisando exames e um plano personalizado"
                loading="lazy"
              />
              <span className="photo-caption light">Escuta antes da estratégia</span>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="process section-pad">
          <div className="shell">
            <div className="process-heading">
              <div>
                <span className="kicker">Como funciona</span>
                <h2>Sua jornada começa com uma avaliação</h2>
              </div>
              <div className="process-thumbnails" aria-label="Momentos da avaliação e do acompanhamento">
                <img src="/images/gio/hero.png" alt="Conversa inicial durante a avaliação" loading="lazy" />
                <img src="/images/gio/para-quem-e.png" alt="Acompanhamento do plano personalizado" loading="lazy" />
              </div>
            </div>
            <ol className="timeline">
              {processSteps.map(([title, text], index) => (
                <li key={title}>
                  <span className="timeline-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="timeline-dot" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <a
              className="text-link"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleWhatsAppClick("como_funciona")}
            >
              Quero agendar minha avaliação <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="transformation section-pad">
          <div className="shell transformation-grid">
            <div className="transformation-copy">
              <span className="kicker kicker-light">Transformação emocional</span>
              <h2>Imagine viver esse processo sem precisar juntar todas as peças sozinho</h2>
              <p>
                Ter profissionais acompanhando alimentação, fatores emocionais, atividade física, cuidados
                estéticos e saúde - dentro de uma jornada conectada e responsável.
              </p>
              <ul>
                {emotionalBenefits.map((item) => (
                  <li key={item}><Check aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <p className="transformation-statement">Desta vez, você não precisa enfrentar o processo sozinho.</p>
              <a
                className="button button-beige"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("transformacao")}
              >
                Quero viver essa experiência <ArrowRight aria-hidden="true" />
              </a>
            </div>
            <div className="transformation-photo image-frame">
              <img
                src="/images/gio/transformacao.png"
                width="1024"
                height="1536"
                alt="Pessoa vivendo sua rotina com confiança e bem-estar"
                loading="lazy"
              />
              <span className="transformation-orbit" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="delay-section section-pad">
          <div className="shell delay-grid">
            <div>
              <span className="kicker">O primeiro passo</span>
              <h2>Adiar também tem um custo</h2>
            </div>
            <div className="delay-lines">
              <p>Mais uma semana evitando determinadas roupas.</p>
              <p>Mais uma ocasião sem se sentir confortável com o próprio corpo.</p>
              <p>Mais uma tentativa que começa com entusiasmo e termina em frustração.</p>
              <p>Mais tempo sentindo que precisa resolver tudo sozinho.</p>
            </div>
            <div className="delay-action">
              <p>
                Você não precisa esperar se sentir completamente preparado. A avaliação é o início da construção
                de um plano pensado para você.
              </p>
              <a
                className="button button-outline"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("custo_adiar")}
              >
                Quero dar o primeiro passo
              </a>
            </div>
          </div>
        </section>

        <section className="objections section-pad">
          <div className="shell objections-layout">
            <div className="objections-heading">
              <span className="kicker">Suas dúvidas importam</span>
              <h2>Você não precisa chegar com todas as respostas</h2>
              <p>
                É justamente por isso que o processo começa com uma avaliação. Você não precisa organizar todas
                as partes sozinho.
              </p>
            </div>
            <div className="objection-cards">
              {objections.map(([question, answer], index) => (
                <article key={question} className={`objection-card objection-${index + 1}`}>
                  <span>“</span>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="equipe" className="team section-pad">
          <div className="shell">
            <div className="team-heading">
              <div>
                <span className="kicker">Equipe e autoridade</span>
                <h2>Conheça os profissionais que acompanharão sua jornada</h2>
              </div>
              <p>
                Os perfis serão publicados após a confirmação dos nomes, registros, biografias e fotografias
                oficiais. Nenhuma credencial foi inventada nesta página.
              </p>
            </div>
            <div className="team-grid">
              {teamRoles.map((role, index) => (
                <article key={role} className={`team-card team-card-${index + 1}`}>
                  <span className="team-placeholder" aria-hidden="true">G.</span>
                  <div>
                    <span className="team-number">0{index + 1}</span>
                    <h3>{role}</h3>
                    <p>Nome, registro, biografia e fotografia em atualização.</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonials section-pad" aria-labelledby="experiencias-title">
          <div className="shell testimonials-grid">
            <div>
              <span className="kicker">Prova social responsável</span>
              <h2 id="experiencias-title">Experiências de quem escolheu ser acompanhado</h2>
            </div>
            <div className="testimonial-placeholder">
              <span aria-hidden="true">“</span>
              <p>
                Depoimentos autorizados serão exibidos aqui com nome ou iniciais, data e origem da avaliação.
              </p>
              <small>Área preparada - nenhum depoimento fictício inserido.</small>
            </div>
          </div>
        </section>

        <section className="gallery section-pad" aria-labelledby="galeria-title">
          <div className="shell">
            <div className="gallery-heading">
              <div>
                <span className="kicker">A experiência Gio</span>
                <h2 id="galeria-title">Cuidado percebido em cada detalhe</h2>
              </div>
              <p>Imagens fornecidas para apresentar acolhimento, conversa, personalização e bem-estar.</p>
            </div>
            <div className="gallery-grid">
              {galleryImages.map(([src, alt], index) => (
                <figure key={src} className={`gallery-item gallery-item-${index + 1}`}>
                  <img src={src} alt={alt} loading="lazy" />
                  <figcaption>{["Recepção e acolhimento", "Rotina e identificação", "Cuidado individual", "Avaliação e planejamento"][index]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="location section-pad">
          <div className="shell location-grid">
            <div className="location-copy">
              <span className="kicker kicker-light">Praia da Costa</span>
              <h2>Cuidado completo perto de você</h2>
              <p>
                Uma experiência premium de saúde, estética e bem-estar em Vila Velha, Espírito Santo.
              </p>
              <dl>
                <div><dt>Unidade</dt><dd>{siteConfig.clinicName}</dd></div>
                <div><dt>Região</dt><dd>{siteConfig.location}</dd></div>
                <div><dt>Instagram</dt><dd>{siteConfig.instagram}</dd></div>
                <div><dt>Endereço e horário</dt><dd>Confirme com a equipe no primeiro contato</dd></div>
              </dl>
              <div className="button-row">
                <a
                  className="button button-beige"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleWhatsAppClick("localizacao")}
                >
                  Falar com a equipe <MessageCircle aria-hidden="true" />
                </a>
                <a
                  className="button button-ghost-light"
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("instagram_click", { location: "localizacao" })}
                >
                  Ver Instagram <Camera aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="location-card">
              <MapPin aria-hidden="true" />
              <p>Praia da Costa</p>
              <strong>Vila Velha · ES</strong>
              <span>Endereço completo será adicionado após confirmação oficial.</span>
            </div>
          </div>
        </section>

        <section id="duvidas" className="faq section-pad">
          <div className="shell faq-grid">
            <div className="faq-heading">
              <span className="kicker">Informação com clareza</span>
              <h2>Tire suas dúvidas sobre o protocolo</h2>
              <p>Respostas diretas para você entender o processo antes do primeiro contato.</p>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <details
                  key={question}
                  onToggle={(event) => {
                    if (event.currentTarget.open) {
                      trackEvent("faq_open", { question_index: index + 1 });
                    }
                  }}
                >
                  <summary>
                    <span>{question}</span>
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta section-pad">
          <div className="shell final-cta-inner">
            <div className="final-cta-copy">
              <span className="kicker kicker-light">Uma jornada conectada</span>
              <h2>Você já tentou emagrecer cuidando de partes isoladas</h2>
              <p>
                Agora, pode viver um processo que acompanha saúde, alimentação, comportamentos, atividade física
                e evolução corporal em conjunto.
              </p>
              <strong>Uma equipe inteira acompanhando a sua jornada.</strong>
            </div>
            <div className="final-cta-card">
              <p>Você não precisa começar mais uma tentativa sozinho.</p>
              <a
                className="button"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("cta_final")}
              >
                Quero viver essa experiência <ArrowRight aria-hidden="true" />
              </a>
              <small>Fale com a equipe e descubra como iniciar sua avaliação.</small>
            </div>
          </div>
        </section>

        <section id="contato" className="lead-section section-pad" ref={formSectionRef}>
          <div className="shell lead-grid">
            <div className="lead-copy">
              <span className="kicker">Seu primeiro contato</span>
              <h2>Descubra se o protocolo é indicado para você</h2>
              <p>
                Preencha seus dados para montar uma mensagem e conversar com a equipe pelo WhatsApp. As respostas
                não são enviadas para ferramentas de análise.
              </p>
              <div className="lead-security">
                <ShieldCheck aria-hidden="true" />
                <span>Contato direto, acolhedor e sem compromisso com um tratamento.</span>
              </div>
            </div>

            <form className="lead-form" onSubmit={handleSubmit} noValidate>
              <div className="field field-wide">
                <label htmlFor="name">Nome completo</label>
                <input id="name" name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
                {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">WhatsApp</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} placeholder="(27) 99999-9999" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
                {errors.phone && <span id="phone-error" className="field-error">{errors.phone}</span>}
              </div>
              <div className="field">
                <label htmlFor="timeTrying">Há quanto tempo tenta emagrecer?</label>
                <select id="timeTrying" name="timeTrying" defaultValue="" aria-invalid={Boolean(errors.timeTrying)} aria-describedby={errors.timeTrying ? "time-error" : undefined}>
                  <option value="" disabled>Selecione</option>
                  <option>Menos de 1 ano</option>
                  <option>Entre 1 e 3 anos</option>
                  <option>Entre 3 e 5 anos</option>
                  <option>Há mais de 5 anos</option>
                </select>
                {errors.timeTrying && <span id="time-error" className="field-error">{errors.timeTrying}</span>}
              </div>
              <div className="field field-wide">
                <label htmlFor="difficulty">Principal dificuldade atualmente</label>
                <textarea id="difficulty" name="difficulty" rows={4} placeholder="Conte brevemente o que mais dificulta seu processo hoje" aria-invalid={Boolean(errors.difficulty)} aria-describedby={errors.difficulty ? "difficulty-error" : undefined} />
                {errors.difficulty && <span id="difficulty-error" className="field-error">{errors.difficulty}</span>}
              </div>
              <div className="field">
                <label htmlFor="priorTreatment">Já realizou tratamento?</label>
                <select id="priorTreatment" name="priorTreatment" defaultValue="" aria-invalid={Boolean(errors.priorTreatment)} aria-describedby={errors.priorTreatment ? "treatment-error" : undefined}>
                  <option value="" disabled>Selecione</option>
                  <option>Sim</option>
                  <option>Não</option>
                  <option>Prefiro conversar com a equipe</option>
                </select>
                {errors.priorTreatment && <span id="treatment-error" className="field-error">{errors.priorTreatment}</span>}
              </div>
              <div className="field">
                <label htmlFor="bestTime">Melhor horário para contato</label>
                <select id="bestTime" name="bestTime" defaultValue="" aria-invalid={Boolean(errors.bestTime)} aria-describedby={errors.bestTime ? "best-time-error" : undefined}>
                  <option value="" disabled>Selecione</option>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                </select>
                {errors.bestTime && <span id="best-time-error" className="field-error">{errors.bestTime}</span>}
              </div>
              <div className="consent field-wide">
                <input id="consent" name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : "consent-help"} />
                <label htmlFor="consent" id="consent-help">
                  Concordo em ser contatado pela equipe da Gio e declaro estar ciente da Política de Privacidade.
                </label>
                {errors.consent && <span id="consent-error" className="field-error">{errors.consent}</span>}
              </div>
              <button className="button form-submit field-wide" type="submit">
                Quero conversar com a equipe <MessageCircle aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <span className="brand-mark">Gio.</span>
            <p>{siteConfig.clinicName}</p>
            <span>{siteConfig.location}</span>
          </div>
          <div className="footer-links">
            <strong>Informações</strong>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">{siteConfig.instagram}</a>
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <a href="/termos-de-uso">Termos de Uso</a>
          </div>
          <div className="footer-pending">
            <strong>Dados em atualização</strong>
            <p>{pendingInformation.slice(0, 4).join(" · ")}</p>
          </div>
        </div>
        <div className="shell footer-notice">
          <p>{medicalNotice}</p>
          <span>© {new Date().getFullYear()} {siteConfig.clinicName}. Todos os direitos reservados.</span>
        </div>
      </footer>

      {!formVisible && !heroActionsVisible && (
        <a
          className="floating-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a equipe pelo WhatsApp"
          onClick={() => handleWhatsAppClick("floating_button")}
        >
          <MessageCircle aria-hidden="true" />
          <span>Falar com a equipe</span>
        </a>
      )}

      {!formVisible && !heroActionsVisible && (
        <a
          className="mobile-fixed-cta"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => handleWhatsAppClick("mobile_bar")}
        >
          Quero saber se o protocolo é para mim
          <ArrowRight aria-hidden="true" />
        </a>
      )}
    </>
  );
}
