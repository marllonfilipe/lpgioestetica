# Landing Page Gio Estética Avançada Praia da Costa

Landing page premium e responsiva para apresentar o protocolo de emagrecimento multidisciplinar da Gio Praia da Costa e conduzir o primeiro contato pelo WhatsApp.

## Executar localmente

Requisitos: Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validar a entrega

```bash
npm run build
npm test
```

## Onde editar

- `src/config/site.ts`: clínica, Instagram, localização, WhatsApp, domínio e IDs de análise.
- `src/config/copy.ts`: textos, listas, FAQ e aviso médico.
- `app/GioLandingPage.tsx`: estrutura, interações, menu, formulário e rastreamento.
- `app/globals.css`: sistema visual e responsividade.
- `public/images/gio/`: fotografias usadas na landing page.
- `public/og.png`: imagem social da página.

## WhatsApp

O número oficial ainda não foi informado. Até que `whatsappNumber` seja preenchido em `src/config/site.ts`, os botões abrem o WhatsApp com a mensagem preparada, mas sem um destinatário fixo. Use somente dígitos e inclua país e DDD, por exemplo: `5527999999999`.

## Formulário

O formulário valida os campos, aplica máscara brasileira no telefone e envia a solicitação para a equipe por meio da Resend. As respostas não são enviadas para analytics nem armazenadas no projeto. A estrutura de rastreamento usa apenas nomes de eventos e localização do CTA.

Variáveis necessárias:

```bash
RESEND_API_KEY=
LEAD_DESTINATION_EMAIL=
RESEND_FROM_EMAIL=
```

## Publicação

O projeto utiliza vinext e mantém dois destinos de publicação:

- OpenAI Sites/Cloudflare Workers: `npm run build`
- Netlify: `npm run build:netlify` (configurado automaticamente pelo `netlify.toml`)

O build do Netlify usa Nitro e gera a saída em `dist`. Configure no painel da plataforma as variáveis `RESEND_API_KEY`, `LEAD_DESTINATION_EMAIL` e `RESEND_FROM_EMAIL` antes de publicar.

## Informações pendentes

- Número oficial do WhatsApp
- Endereço completo, horário e link do mapa
- Logo oficial
- Fotografias oficiais da unidade e dos profissionais
- Nomes, especialidades, registros e biografias da equipe
- Depoimentos autorizados e avaliação real no Google
- IDs oficiais de analytics e pixels
- URL oficial do domínio

Nenhum depoimento, resultado, credencial, endereço, número de pacientes ou promessa médica foi inventado.
