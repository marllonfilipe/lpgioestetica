import type { Metadata } from "next";
import Link from "next/link";
import { medicalNotice } from "../../src/config/copy";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso da página informativa da Gio Praia da Costa.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href="/">← Voltar para a página inicial</Link>
        <span className="kicker">Uso responsável</span>
        <h1>Termos de Uso</h1>
        <p className="legal-intro">
          Ao navegar nesta página, você reconhece que o conteúdo tem finalidade informativa e que decisões de saúde dependem de avaliação profissional individual.
        </p>
        <section>
          <h2>Conteúdo informativo</h2>
          <p>{medicalNotice}</p>
        </section>
        <section>
          <h2>Resultados individuais</h2>
          <p>
            Não há promessa ou garantia de emagrecimento, prazo, quantidade de peso ou resultado estético. Cada pessoa pode responder de maneira diferente ao acompanhamento.
          </p>
        </section>
        <section>
          <h2>Contato pelo WhatsApp</h2>
          <p>
            O envio de uma mensagem não cria relação profissional, não confirma elegibilidade para o protocolo e não substitui consulta, diagnóstico ou prescrição.
          </p>
        </section>
        <section>
          <h2>Atualizações</h2>
          <p>
            Informações sobre equipe, endereço, horários, serviços e canais oficiais poderão ser atualizadas quando os dados forem confirmados pela clínica.
          </p>
        </section>
      </div>
    </main>
  );
}
