"use client";

import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Syringe,
  UsersRound,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
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
import { siteConfig } from "../src/config/site";
import { trackEvent } from "../src/lib/analytics";
import { buildWhatsAppUrl } from "../src/lib/whatsapp";

const protocolIcons = {
  medical: HeartPulse,
  exams: ClipboardList,
  nutrition: Apple,
  psychology: Brain,
  movement: Dumbbell,
  aesthetics: Sparkles,
  tirzepatide: Syringe,
};

const teamAreaIcons = [Brain, Apple, Dumbbell, Sparkles] as const;

export default function GioLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contextualActionsVisible, setContextualActionsVisible] = useState(false);
  const [heroActionsVisible, setHeroActionsVisible] = useState(true);
  const heroActionsRef = useRef<HTMLDivElement | null>(null);
  const packageSectionRef = useRef<HTMLElement | null>(null);
  const clinicSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = [packageSectionRef.current, clinicSectionRef.current].filter(
      (section): section is HTMLElement => Boolean(section),
    );
    if (sections.length === 0) return;

    const visibleSections = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target);
          else visibleSections.delete(entry.target);
        });
        setContextualActionsVisible(visibleSections.size > 0);
      },
      { threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const heroActions = heroActionsRef.current;
    if (!heroActions) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroActionsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: 0.6 },
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
  const packageWhatsappHref = buildWhatsAppUrl(
    "Olá! Vi o protocolo completo no site e gostaria de entender o investimento, as condições de pagamento e como funciona a avaliação.",
  );

  function handleWhatsAppClick(location: string) {
    trackEvent("whatsapp_click", { location });
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner shell">
          <a className="brand" href="#hero" aria-label="Gio Estética Avançada, início">
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
              <h1>
                Você já tentou fazer dieta, voltar a treinar e mudar sua rotina.{" "}
                <em>O que faltou não foi esforço. Foi um plano acompanhando você por inteiro.</em>
              </h1>
              <p className="hero-lead">
                Um protocolo personalizado que reúne consultas médicas, exames laboratoriais, acompanhamento
                nutricional, psicológico, estético e orientações para atividade física.
              </p>
              <div className="button-row" ref={heroActionsRef}>
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
              <p className="hero-support">
                Na Gio, profissionais acompanham saúde, alimentação, comportamento, movimento e evolução
                corporal. O tratamento medicamentoso entra quando indicado pelo médico.
              </p>
              <div className="hero-indicators" aria-label="Diferenciais">
                {["Avaliação individual", "Equipe multidisciplinar", "Acompanhamento próximo"].map((item) => (
                  <span key={item}>
                    <Check aria-hidden="true" /> {item}
                  </span>
                ))}
              </div>
              <p className="medical-note">
                <ShieldCheck aria-hidden="true" /> O protocolo é definido individualmente. Tratamentos e
                medicamentos dependem de avaliação, indicação, prescrição e acompanhamento médico.
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
              <span className="photo-caption">Cuidado completo</span>
            </div>
          </div>
        </section>

        <section className="fronts-band" aria-label="As seis frentes do protocolo">
          <div className="shell fronts-grid">
            {sixFronts.map(([title, text], index) => (
              <a
                key={title}
                className="front-item"
                href={`#protocolo-${["medical", "exams", "nutrition", "aesthetics", "movement", "tirzepatide"][index]}`}
              >
                <strong>{title}</strong>
                <span>{text}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="identificacao" className="identification section-pad">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <h2>Não é só cansaço de tentar. É o peso de tentar sozinho.</h2>
              </div>
              <p>
                Emagrecer envolve mais que comer menos e treinar. Saúde, rotina, emoções, movimento e resposta
                ao tratamento também precisam ser considerados.
              </p>
            </div>

            <div className="identification-layout">
              <div className="identification-image image-frame">
                <img
                  src="/images/gio/identificacao-avaliacao.png"
                  width="1672"
                  height="941"
                  alt="Profissional avaliando medidas corporais de uma paciente durante o acompanhamento"
                  loading="lazy"
                />
                <span className="image-note">“Você se reconhece em alguma dessas situações?”</span>
              </div>
              <div className="statement-grid">
                {identificationItems.map((item, index) => (
                  <article key={item} className={`statement statement-${index + 1}`}>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="editorial-callout">
              <p>
                Não faltou disciplina. Faltou um plano que considere você por completo.
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
                  <strong>{step}</strong>
                </div>
              ))}
              <p className="cycle-center">O ciclo<br />recomeça</p>
            </div>
            <div className="cycle-copy">
              <h2>O ciclo não começa na falta de esforço</h2>
              <p>
                Você reorganiza a alimentação, retoma os exercícios e percebe mudanças. Quando a rotina aperta,
                sustentar tudo sozinho fica mais difícil.
              </p>
              <blockquote>
                O problema não é você. É tentar cuidar de algo complexo com soluções isoladas.
              </blockquote>
              <p>
                Por isso, a Gio estruturou um protocolo com cuidados médicos, nutricionais, psicológicos,
                estéticos e atividade física.
              </p>
            </div>
          </div>
        </section>

        <section id="protocolo" className="protocol section-pad">
          <div className="shell">
            <div className="protocol-intro">
              <div className="protocol-application-heading">
                <h2>Um plano de tratamento estruturado para acompanhar <em>diferentes partes do seu processo.</em></h2>
                <p>
                  A Gio reúne avaliações, profissionais e cuidados em uma única jornada.
                </p>
                <p className="protocol-medical-disclaimer">
                  <ShieldCheck aria-hidden="true" /> O médico define as condutas clínicas e avalia a indicação de
                  tratamento medicamentoso.
                </p>
              </div>
              <div className="protocol-photo image-frame">
                <img
                  src="/images/gio/protocolo-avaliacao.png"
                  width="1672"
                  height="941"
                  alt="Profissional realizando avaliação personalizada de uma paciente na Gio"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="protocol-areas-intro">
              <h3>Um plano acompanhado por diferentes áreas.</h3>
              <p>Conheça os cuidados que integram o plano:</p>
            </div>

            <div className="protocol-bento">
              {protocolCards.map((card) => {
                const Icon = protocolIcons[card.key as keyof typeof protocolIcons];
                return (
                  <details
                    key={card.key}
                    id={`protocolo-${card.key}`}
                    className={`protocol-card protocol-${card.key}`}
                  >
                    <summary className="expandable-summary protocol-card-summary">
                      <div className="protocol-card-top">
                        <Icon aria-hidden="true" />
                      </div>
                      <h3>{card.title}</h3>
                      <span className="expandable-action">
                        <span className="expandable-action-closed">Ver detalhes</span>
                        <span className="expandable-action-open">Fechar detalhes</span>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="expandable-content">
                      <p>{card.text}</p>
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="protocol-footer">
              <p>Um plano, diferentes cuidados trabalhando em conjunto.</p>
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
              <h2>Não é escolher entre dieta, exercício, estética ou medicação.</h2>
              <p>É entender como cada parte pode contribuir para o seu processo.</p>
            </div>
            <div className="contrast-grid">
              <article className="contrast-isolated">
                <span className="contrast-label">Quando tudo acontece de forma isolada</span>
                {["Dieta sem considerar sua rotina", "Exercício difícil de sustentar", "Medicação sem cuidado com hábitos", "Estética desconectada do plano", "Orientações desconectadas", "Organizar tudo sozinho"].map((item) => (
                  <p key={item}><span aria-hidden="true" />{item}</p>
                ))}
              </article>
              <article className="contrast-integrated">
                <span className="contrast-label">Quando existe um plano integrado</span>
                {["Saúde avaliada pelo médico", "Exames orientando condutas", "Alimentação acompanhada", "Emoções e comportamentos considerados", "Atividade física possível", "Cuidados estéticos integrados", "Medicação dentro da estratégia médica"].map((item) => (
                  <p key={item}><Check aria-hidden="true" />{item}</p>
                ))}
              </article>
            </div>
            <p className="contrast-conclusion">
              Cada parte tem uma função dentro do mesmo plano.
            </p>
          </div>
        </section>

        <section id="para-quem-e" className="audience section-pad">
          <div className="shell audience-grid">
            <div className="audience-photo image-frame">
              <img
                src="/images/gio/protocolo-para-voce.png"
                width="2048"
                height="1152"
                alt="Profissional apresentando o protocolo personalizado da Gio"
                loading="lazy"
              />
              <div className="audience-overlap">
                Para quem deseja avaliação e acompanhamento de acordo com a própria realidade, sem uma fórmula pronta.
              </div>
            </div>
            <div className="audience-copy">
              <h2>Este protocolo foi pensado para você que:</h2>
              <ul className="editorial-list">
                {audienceItems.slice(0, 4).map((item) => (
                  <li key={item}><span aria-hidden="true">✦</span>{item}</li>
                ))}
              </ul>
              <details className="audience-more expandable-details">
                <summary className="expandable-summary">
                  <span className="expandable-action">
                    <span className="expandable-action-closed">Ver todos os perfis</span>
                    <span className="expandable-action-open">Ocultar perfis</span>
                    <ChevronDown aria-hidden="true" />
                  </span>
                </summary>
                <ul className="editorial-list audience-more-list">
                  {audienceItems.slice(4).map((item) => (
                    <li key={item}><span aria-hidden="true">✦</span>{item}</li>
                  ))}
                </ul>
              </details>
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
              <h2>O seu processo não deveria ser igual ao de todo mundo.</h2>
              <p className="large-copy">
                Cada pessoa tem um histórico, uma rotina e uma resposta diferente.
              </p>
              <p>
                Por isso, o plano começa compreendendo:
              </p>
              <div className="personalization-list">
                {personalizationItems.map((item) => (
                  <span key={item}><Check aria-hidden="true" />{item}</span>
                ))}
              </div>
              <blockquote>
                Você não precisa se encaixar em um método genérico. O plano deve caber na sua realidade.
              </blockquote>
            </div>
            <div className="personalization-photo image-frame">
              <img
                src="/images/gio/processo-personalizado.png"
                width="2048"
                height="1152"
                alt="Profissional e paciente analisando um plano alimentar personalizado"
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
                <h2>Sua jornada começa com uma avaliação.</h2>
              </div>
              <div className="process-thumbnails" aria-label="Momentos da avaliação e do acompanhamento">
                <img src="/images/gio/hero.png" alt="Conversa inicial durante a avaliação" loading="lazy" />
                <img src="/images/gio/para-quem-e.png" alt="Acompanhamento do plano personalizado" loading="lazy" />
              </div>
            </div>
            <ol className="timeline">
              {processSteps.map(([title, text]) => (
                <li key={title}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <h3>{title}</h3>
                  <details className="expandable-details">
                    <summary className="expandable-summary">
                      <span className="expandable-action">
                        <span className="expandable-action-closed">Entender esta etapa</span>
                        <span className="expandable-action-open">Ocultar explicação</span>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="expandable-content">
                      <p>{text}</p>
                    </div>
                  </details>
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

        <section id="investimento" className="package-section section-pad" ref={packageSectionRef}>
          <div className="shell package-grid">
            <div className="package-copy">
              <h2>O protocolo completo, em um só investimento.</h2>
              <p>
                Veja o que está previsto e consulte as condições com a equipe.
              </p>
              <div className="package-items" aria-label="Itens previstos no protocolo">
                {protocolCards.map((card) => (
                  <div key={card.key} className="package-item">
                    <Check aria-hidden="true" />
                    <span>{card.title}</span>
                  </div>
                ))}
              </div>
              <p className="package-disclaimer">
                <ShieldCheck aria-hidden="true" />
                Exames, aplicações e medicamentos dependem de avaliação e indicação profissional.
              </p>
            </div>

            <aside className="package-offer" aria-label="Investimento no protocolo">
              <p className="package-offer-title">Investimento</p>
              <strong className="package-price">Sob agendamento</strong>
              <p className="package-payment">
                Receba valores e condições antes de decidir.
              </p>
              <a
                className="button button-light package-button"
                href={packageWhatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("investimento")}
              >
                Consultar investimento pelo WhatsApp
                <ArrowRight aria-hidden="true" />
              </a>
              <small>O contato não representa contratação nem indicação de tratamento.</small>
            </aside>
          </div>
        </section>

        <section className="transformation section-pad">
          <div className="shell transformation-grid">
            <div className="transformation-copy">
              <h2>Imagine viver esse processo sem precisar juntar todas as peças sozinho.</h2>
              <p>
                Profissionais acompanhando saúde, alimentação, comportamento, atividade física e mudanças corporais.
              </p>
              <ul>
                {emotionalBenefits.map((item) => (
                  <li key={item}><Check aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <p className="transformation-statement">Desta vez, você não precisa organizar tudo sozinho.</p>
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
                src="/images/gio/jornada-acompanhada-v3.png"
                width="1672"
                height="941"
                alt="Equipe multidisciplinar reunida com paciente durante o acompanhamento"
                loading="lazy"
              />
              <span className="transformation-orbit" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="delay-section section-pad">
          <div className="shell delay-grid">
            <div>
              <h2>Você não precisa esperar estar completamente preparado.</h2>
            </div>
            <div className="delay-lines">
              <p>Você ainda tem dúvidas.</p>
              <p>A indicação do tratamento medicamentoso precisa ser avaliada para o seu caso.</p>
              <p>Você tem receio de começar e interromper novamente.</p>
              <p>Ainda não ficou claro qual profissional procurar primeiro.</p>
            </div>
            <div className="delay-action">
              <p>
                Por isso, tudo começa com uma avaliação. Você não precisa ter todas as respostas. A equipe
                começa conhecendo seu caso.
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
              <h2>Suas dúvidas fazem parte do processo.</h2>
              <p>
                A avaliação esclarece possibilidades e o que faz sentido para o seu momento.
              </p>
            </div>
            <div className="objection-cards">
              {objections.map(([question, answer], index) => (
                <article key={question} className={`objection-card objection-${index + 1}`}>
                  <span>“</span>
                  <h3>{question}</h3>
                  <details className="expandable-details">
                    <summary className="expandable-summary">
                      <span className="expandable-action">
                        <span className="expandable-action-closed">Ver resposta</span>
                        <span className="expandable-action-open">Ocultar resposta</span>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="expandable-content">
                      <p>{answer}</p>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="equipe" className="team section-pad">
          <div className="shell">
            <div className="team-heading">
              <div>
                <h2>Conheça os profissionais que acompanharão sua jornada.</h2>
              </div>
              <p>Cada área cumpre uma função dentro do plano.</p>
            </div>

            <div className="team-showcase">
              <article className="team-lead-card">
                <div className="team-lead-visual">
                  <span className="team-lead-symbol" aria-hidden="true">
                    <HeartPulse />
                  </span>
                  <div>
                    <span>Coordenação clínica</span>
                    <strong>Avaliação individual</strong>
                  </div>
                </div>
                <div className="team-lead-content">
                  <span className="team-role-tag">Coordenação médica</span>
                  <h3>Dr. Daniel Gomes de Figueiredo</h3>
                  <details className="expandable-details">
                    <summary className="expandable-summary">
                      <span className="expandable-action">
                        <span className="expandable-action-closed">Conhecer atuação</span>
                        <span className="expandable-action-open">Ocultar atuação</span>
                        <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="expandable-content">
                      <p>{teamRoles[0][1]}</p>
                    </div>
                  </details>
                </div>
              </article>

              <div className="team-area-grid">
                {teamRoles.slice(1).map(([role, description], index) => {
                  const TeamAreaIcon = teamAreaIcons[index];

                  if (role === "Estética") {
                    return (
                      <article key={role} className="team-area-card team-area-card-profile">
                        <img
                          src="/images/gio/thassia-garcia-estetica.jpeg"
                          alt="Thassia Garcia, profissional da área de estética da Gio Praia da Costa"
                          width="1365"
                          height="2048"
                          loading="lazy"
                        />
                        <div className="team-profile-content">
                          <span className="team-area-label">Profissional de estética</span>
                          <h3>Thassia Garcia</h3>
                          <details className="expandable-details">
                            <summary className="expandable-summary">
                              <span className="expandable-action">
                                <span className="expandable-action-closed">Conhecer atuação</span>
                                <span className="expandable-action-open">Ocultar atuação</span>
                                <ChevronDown aria-hidden="true" />
                              </span>
                            </summary>
                            <div className="expandable-content">
                              <p>{description}</p>
                            </div>
                          </details>
                        </div>
                      </article>
                    );
                  }

                  return (
                    <article key={role} className="team-area-card">
                      <div className="team-area-card-top">
                        <span className="team-area-icon" aria-hidden="true">
                          <TeamAreaIcon />
                        </span>
                      </div>
                      <div>
                        <h3>{role}</h3>
                        {role === "Nutrição" && (
                          <span className="team-assignment-note">Profissional definido conforme o caso</span>
                        )}
                        <details className="expandable-details">
                          <summary className="expandable-summary">
                            <span className="expandable-action">
                              <span className="expandable-action-closed">Conhecer atuação</span>
                              <span className="expandable-action-open">Ocultar atuação</span>
                              <ChevronDown aria-hidden="true" />
                            </span>
                          </summary>
                          <div className="expandable-content">
                            <p>{description}</p>
                          </div>
                        </details>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="team-integration">
              <div>
                <span>Trabalho integrado</span>
                <strong>Diferentes especialidades, um plano construído em conjunto.</strong>
              </div>
              <a
                className="button team-cta"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("equipe")}
              >
                Quero conhecer como funciona a avaliação <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section id="depoimentos" className="testimonials section-pad" aria-labelledby="experiencias-title">
          <div className="shell">
            <div className="testimonials-heading">
              <div>
                <h2 id="experiencias-title">Histórias de quem escolheu cuidar do processo por inteiro.</h2>
              </div>
              <p>
                Um relato real sobre evolução, constância e motivação ao longo do processo.
              </p>
            </div>

            <div className="testimonials-stage">
              <article className="testimonial-featured">
                <div className="testimonial-media">
                  <img
                    src="/images/gio/depoimento-resultado-9kg.jpeg"
                    alt="Registro comparativo da evolução de um paciente durante sua jornada"
                    width="720"
                    height="1280"
                    loading="lazy"
                  />
                  <div>
                    <span>Registro da jornada</span>
                    <strong>Imagem enviada pelo paciente</strong>
                  </div>
                </div>
                <div className="testimonial-story">
                  <span className="testimonial-story-label">Depoimento de paciente</span>
                  <h3>“Um marco importante da minha jornada.”</h3>
                  <blockquote className="testimonial-quote">
                    <p>
                      Passando para registrar um marco importante da minha jornada! Há dois meses e meio dei o
                      pontapé inicial pesando 94 kg. Há dois meses passei a usar a tirzepatida de um novo
                      fornecedor e segui firme no processo.
                    </p>
                    <p>
                      Hoje, ao subir na balança, marquei 85 kg totalizando 9 kg a menos! Fico muito feliz em ver
                      como meu corpo respondeu bem ao tratamento e à constância. Seguimos em frente com ainda
                      mais motivação!
                    </p>
                  </blockquote>
                  <div className="testimonial-person">
                    <span aria-hidden="true">G</span>
                    <div>
                      <strong>Paciente Gio</strong>
                      <small>Identificação preservada.</small>
                    </div>
                  </div>
                </div>
              </article>
              <div className="testimonials-side">
                <article className="testimonial-note">
                  <div className="testimonial-note-top">
                    <span>−9 kg</span>
                    <small>Marco relatado</small>
                  </div>
                  <h3>De 94 kg para 85 kg</h3>
                  <p>Resultado informado pelo paciente no momento deste depoimento.</p>
                </article>
                <article className="testimonial-note testimonial-note-dark">
                  <div className="testimonial-note-top">
                    <span>2,5 meses</span>
                    <small>Jornada</small>
                  </div>
                  <h3>Constância</h3>
                  <p>Tempo entre o início da jornada e o registro compartilhado.</p>
                </article>
              </div>
            </div>

            <div className="testimonials-trust">
              <p>
                <ShieldCheck aria-hidden="true" />
                <span>Relatos individuais e autorizados. Cada organismo pode responder de forma diferente.</span>
              </p>
              <a
                className="button testimonials-cta"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("depoimentos")}
              >
                Quero entender se faz sentido para mim <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="clinic-showcase section-pad" ref={clinicSectionRef}>
          <div className="shell clinic-showcase-grid">
            <div className="clinic-showcase-copy">
              <h2>Conheça a Gio Praia da Costa.</h2>
              <p>
                Conforto, privacidade e cuidado para receber você.
              </p>
              <div className="clinic-features">
                {[
                  "Atendimento integrado",
                  "Estrutura na Praia da Costa",
                ].map((item) => (
                  <span key={item}><Check aria-hidden="true" />{item}</span>
                ))}
              </div>
              <div className="clinic-actions">
                <a
                  className="button button-beige"
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("maps_click", { location: "clinica" })}
                >
                  Abrir no Google Maps <MapPin aria-hidden="true" />
                </a>
                <a
                  className="button button-ghost-light"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleWhatsAppClick("clinica")}
                >
                  Falar com a equipe <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
                </a>
              </div>
              <address>{siteConfig.fullAddress}</address>
            </div>
          </div>
        </section>

        <section id="duvidas" className="faq section-pad">
          <div className="shell faq-grid">
            <div className="faq-heading">
              <h2>Entenda o protocolo antes do primeiro contato.</h2>
              <p>Veja o que está incluído e como iniciar sua avaliação.</p>
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
              <h2>Você já tentou emagrecer cuidando de partes isoladas.</h2>
              <p>
                Conheça um plano que integra saúde, alimentação, comportamento, movimento e evolução corporal.
              </p>
              <strong>Um plano acompanhado por diferentes profissionais.</strong>
            </div>
            <div className="final-cta-card">
              <p>Você não precisa organizar todas as partes sozinho.</p>
              <a
                className="button"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleWhatsAppClick("cta_final")}
              >
                Quero saber se é para mim <ArrowRight aria-hidden="true" />
              </a>
              <small>Fale com a equipe e saiba como começar.</small>
            </div>
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
            <strong>Atendimento</strong>
            <p>{siteConfig.fullAddress} · {siteConfig.openingHours} · WhatsApp: (27) 99775-6738</p>
          </div>
        </div>
        <div className="shell footer-notice">
          <p>{medicalNotice}</p>
          <span>© {new Date().getFullYear()} {siteConfig.clinicName}. Todos os direitos reservados.</span>
        </div>
      </footer>

      {!contextualActionsVisible && !heroActionsVisible && (
        <a
          className="floating-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a equipe pelo WhatsApp"
          onClick={() => handleWhatsAppClick("floating_button")}
        >
          <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
          <span>Falar com a equipe</span>
        </a>
      )}

      {!contextualActionsVisible && !heroActionsVisible && (
        <a
          className="mobile-fixed-cta"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => handleWhatsAppClick("mobile_bar")}
        >
          Quero conversar com a equipe
          <ArrowRight aria-hidden="true" />
        </a>
      )}
    </>
  );
}
