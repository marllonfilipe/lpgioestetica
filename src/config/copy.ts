export const navigation = [
  { label: "O protocolo", href: "#protocolo" },
  { label: "Para quem é", href: "#para-quem-e" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Equipe", href: "#equipe" },
  { label: "Dúvidas", href: "#duvidas" },
] as const;

export const sixFronts = [
  ["Consultas médicas", "Duas consultas previstas ao longo do plano"],
  ["Exames laboratoriais", "Conforme avaliação e solicitação médica"],
  ["Nutrição e psicologia", "Alimentação, emoções e comportamento"],
  ["Cuidados estéticos", "Acompanhando as mudanças corporais"],
  ["Atividade física", "Orientações compatíveis com seu momento"],
  ["Tratamento medicamentoso", "Quando indicado pelo médico"],
] as const;

export const identificationItems = [
  "Começa decidido a mudar, mas tem dificuldade para manter a rotina.",
  "Segue a alimentação por alguns dias, mas cansaço, ansiedade ou compromissos tiram você do plano.",
  "Volta a treinar, mas não vê o resultado esperado ou perde a frequência.",
  "Perde alguns quilos e, depois, sente que voltou ao ponto de partida.",
  "Compra roupas pensando em quando vai emagrecer.",
  "Evita fotos, eventos ou roupas porque não se sente confortável.",
  "Recebe diferentes orientações, mas não consegue transformá-las em um plano possível.",
  "Tenta organizar alimentação, exercícios, emoções e tratamento sem saber por onde começar.",
] as const;

export const cycleSteps = [
  "Começa motivado",
  "Controla a alimentação",
  "Tenta encaixar exercícios",
  "Percebe alguma evolução",
  "A rotina fica mais difícil",
  "O plano deixa de ser seguido",
  "A frustração aumenta",
  "Uma nova tentativa começa",
] as const;

export const protocolCards = [
  {
    key: "medical",
    title: "Duas consultas médicas",
    text: "Duas consultas para avaliar seu histórico, sua saúde e a resposta ao tratamento.",
  },
  {
    key: "exams",
    title: "Exames laboratoriais",
    text: "Exames definidos por avaliação e solicitação médica para orientar a estratégia.",
  },
  {
    key: "nutrition",
    title: "Acompanhamento nutricional",
    text: "Orientação para sua rotina, hábitos, dificuldades e objetivos, sem dieta pronta.",
  },
  {
    key: "psychology",
    title: "Acompanhamento psicológico",
    text: "Cuidado com fatores emocionais e comportamentais ligados à alimentação e à continuidade.",
  },
  {
    key: "aesthetics",
    title: "Cuidados estéticos",
    text: "Tratamentos definidos conforme as necessidades das mudanças corporais.",
  },
  {
    key: "tirzepatide",
    title: "Tratamento medicamentoso",
    text: "Pode integrar o protocolo mediante avaliação, indicação, prescrição e acompanhamento médico.",
  },
  {
    key: "movement",
    title: "Orientações para atividade física",
    text: "Movimento compatível com seu momento, sem exigir uma rotina perfeita.",
  },
] as const;

export const audienceItems = [
  "Luta contra o peso há anos e já tentou diferentes dietas",
  "Já começou e interrompeu atividades físicas",
  "Sente que o resultado não acompanha o esforço",
  "Perde peso, mas tem dificuldade para manter",
  "Percebe as emoções interferindo na alimentação",
  "Tem dificuldade para organizar tantas orientações",
  "Busca avaliação profissional e um plano personalizado",
  "Não quer depender apenas de medicação",
  "Quer cuidar de saúde, alimentação, comportamento, movimento e corpo de forma integrada",
] as const;

export const personalizationItems = [
  "Seu histórico e suas condições de saúde",
  "Suas tentativas anteriores",
  "Sua rotina",
  "Suas principais dificuldades",
  "Seus objetivos",
  "Sua relação com a alimentação",
  "Sua relação com a atividade física",
  "Sua relação com o próprio corpo",
] as const;

export const processSteps = [
  ["Conversa com a equipe", "Conte seu objetivo, tire dúvidas e conheça os próximos passos pelo WhatsApp."],
  ["Avaliação do seu caso", "Histórico, rotina, dificuldades e objetivos orientam a estratégia."],
  ["Consulta e exames", "Duas consultas médicas e exames conforme avaliação e solicitação profissional."],
  ["Definição do plano", "A equipe integra cuidados médicos, nutricionais, psicológicos, estéticos e atividade física."],
  ["Avaliação do tratamento medicamentoso", "O médico avalia a indicação de tratamento medicamentoso."],
  ["Acompanhamento da jornada", "Os profissionais acompanham respostas, dificuldades e evolução ao longo do protocolo."],
] as const;

export const emotionalBenefits = [
  "Mais clareza sobre o próximo passo",
  "Mais segurança para começar",
  "Mais apoio nas dificuldades",
  "Uma estratégia possível para sua rotina",
  "Menos sensação de começar e parar",
  "Um plano que não depende só da força de vontade",
] as const;

export const objections = [
  ["Não sei se o tratamento medicamentoso é indicado para mim.", "A indicação depende da avaliação médica, do seu histórico e das suas condições de saúde."],
  ["Tenho medo de começar e desistir novamente.", "Diferentes profissionais acompanham também as dificuldades da jornada."],
  ["Não consigo seguir uma rotina perfeita.", "O plano considera sua realidade, suas possibilidades e seu momento."],
  ["Já tentei dieta e exercício e não consegui manter.", "As tentativas anteriores ajudam a equipe a entender o que precisa mudar."],
  ["Não sei qual profissional procurar primeiro.", "A equipe da Gio apresenta os próximos passos no primeiro contato."],
] as const;

export const teamRoles = [
  ["Médico responsável", "Dr. Daniel Gomes de Figueiredo é médico cardiologista e avalia histórico, saúde, resposta ao tratamento e indicação medicamentosa."],
  ["Psicologia", "Considera fatores emocionais e comportamentais ligados à alimentação e à continuidade."],
  ["Nutrição", "Organiza uma estratégia alimentar possível para rotina, hábitos e objetivos."],
  ["Atividade física", "Orienta o movimento de forma progressiva e compatível com o momento atual."],
  ["Estética", "Conecta os cuidados corporais às necessidades do protocolo."],
] as const;

export const faqs = [
  ["O que está incluído no protocolo?", "Duas consultas médicas, exames, nutrição, psicologia, estética, atividade física e medicação quando indicada."],
  ["O tratamento medicamentoso é indicado para todas as pessoas?", "Não. A indicação depende da avaliação médica e das condições de cada paciente."],
  ["O protocolo é igual para todos?", "Não. As condutas consideram histórico, saúde, rotina, dificuldades e objetivos."],
  ["Quais exames estão incluídos?", "O profissional responsável define e solicita os exames. A clínica informa a relação na avaliação."],
  ["Quantas aplicações estão incluídas?", "A quantidade depende da avaliação e da estratégia médica."],
  ["Preciso já praticar atividade física?", "Não. As orientações ajudam a inserir movimento conforme seu momento e suas possibilidades."],
  ["Posso participar mesmo já tendo tentado outros tratamentos?", "Sim. Suas tentativas anteriores serão consideradas na avaliação."],
  ["Os resultados são iguais para todas as pessoas?", "Não. A resposta varia conforme saúde, organismo, rotina e adesão ao plano."],
  ["Como faço para começar?", "Clique em um botão e converse com a equipe pelo WhatsApp."],
] as const;

export const medicalNotice =
  "As informações desta página possuem caráter informativo e não substituem avaliação, consulta ou orientação profissional. A participação no protocolo, a realização de procedimentos e a utilização de medicamentos dependem da avaliação individual e da indicação dos profissionais responsáveis. Os resultados podem variar conforme as condições de saúde, a resposta do organismo, a rotina e a adesão de cada pessoa ao plano.";
