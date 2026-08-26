import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../src/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Informações sobre privacidade e tratamento de dados da clínica na Praia da Costa.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href="/">← Voltar para a página inicial</Link>
        <span className="kicker">Privacidade</span>
        <h1>Política de Privacidade</h1>
        <p className="legal-intro">
          Esta página explica, de forma simples, como os dados informados durante o contato com a {siteConfig.shortName} podem ser utilizados.
        </p>
        <section>
          <h2>Dados informados por você</h2>
          <p>
            Ao preencher o formulário, nome, WhatsApp, dificuldade relatada e registro do consentimento são enviados por e-mail à equipe da clínica para atendimento da solicitação. Esses dados não são enviados para ferramentas de análise.
          </p>
        </section>
        <section>
          <h2>Finalidade do contato</h2>
          <p>
            As informações são utilizadas para responder ao seu interesse, orientar o primeiro contato e apresentar os próximos passos de uma possível avaliação. Nenhum tratamento é iniciado apenas com o envio da mensagem.
          </p>
        </section>
        <section>
          <h2>E-mail, WhatsApp e serviços de terceiros</h2>
          <p>
            O envio do formulário utiliza a Resend como infraestrutura de entrega de e-mail. Ao continuar o contato pelo WhatsApp, o tratamento de dados também passa a seguir as regras e políticas desse serviço. Evite informar dados médicos além do necessário antes de receber orientação adequada da equipe.
          </p>
        </section>
        <section>
          <h2>Seus direitos</h2>
          <p>
            Você pode solicitar informações, correção ou exclusão de dados mantidos pela clínica por meio dos canais oficiais. Os dados completos de contato e do responsável serão adicionados após confirmação oficial.
          </p>
        </section>
        <p className="legal-updated">Versão informativa preparada para publicação. Dados formais de contato permanecem pendentes de confirmação.</p>
      </div>
    </main>
  );
}
