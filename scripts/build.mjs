import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, buildWhatsappUrl } from '../src/data/site.mjs';
import { SERVICES } from '../src/data/services.mjs';
import {
  escapeHtml,
  renderLayout,
  renderBreadcrumb,
  renderQuoteForm,
  renderFaqSection,
  renderLocationAndMapSection,
  renderReviewsSection,
  buildFaqSchema,
  buildServiceSchema,
  buildBreadcrumbSchema
} from '../src/templates/layout.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function writePage(relPath, html) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Built: ${relPath}`);
}

const HOME_FAQS = [
  {
    q: 'Onde fica a Ângelo Car Oficina Mecânica em Porto Alegre?',
    a: 'Ficamos na Av. Vicente Monteggia, 333, no bairro Cavalhada, Zona Sul de Porto Alegre (RS), CEP 91740-290. Temos acesso direto pela avenida e pátio com elevadores.'
  },
  {
    q: 'Qual é o horário de atendimento da oficina física e do socorro 24h?',
    a: 'Nossa oficina física atende todos os dias das 08h às 19h por ordem de chegada. Já o nosso plantão de socorro mecânico móvel atende 24 horas por dia, inclusive na madrugada (00h às 07h), em Porto Alegre.'
  },
  {
    q: 'Quanto custa a carga de gás do ar-condicionado e o scanner automotivo?',
    a: 'A carga de gás de ar-condicionado automotivo parte de R$ 300,00 (com avaliação de vazamentos). O diagnóstico completo com scanner automotivo custa R$ 150,00.'
  },
  {
    q: 'Quais serviços vocês NÃO executam na oficina?',
    a: 'Para manter máxima qualidade e transparência, não executamos serviços de borracharia/pneu furado, geometria/alinhamento/balanceamento, reparo interno de câmbio automático, GNV ou elétrica pesada de chicote/air bag.'
  },
  {
    q: 'Como pedir um orçamento rápido ou chamar socorro agora?',
    a: 'Clique no botão de WhatsApp ou ligue diretamente para (51) 98428-1009 informando o modelo do carro, o bairro e o que está acontecendo.'
  }
];

function buildHomePage() {
  const waHome = buildWhatsappUrl('Olá Ângelo Car! Vim pelo site angelocar.com.br e preciso de atendimento na oficina.');
  const bodyHtml = `
  <!-- Hero Principal -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="hero-eyebrow">Cavalhada • Zona Sul de Porto Alegre</span>
        <h1>Oficina Mecânica em Porto Alegre e Socorro Mecânico 24h</h1>
        <p class="hero-lead">
          Estrutura própria na <strong>Av. Vicente Monteggia, 333</strong> com elevadores, atendimento presencial todos os dias (08h–19h) e plantão móvel 24 horas. Ar-condicionado automotivo, retífica e conserto de motor, freios, suspensão e scanner.
        </p>
        <div class="hero-cta-group">
          <a id="cta-whatsapp-hero" href="${waHome}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="home" data-location="hero">
            Chamar no WhatsApp
          </a>
          <a id="cta-ligar-hero" href="tel:${SITE.phoneHref}" class="btn btn-outline-dark" data-track="phone_call_click" data-service="home" data-location="hero">
            Ligar ${SITE.phoneDisplay}
          </a>
        </div>
        <div class="hero-trust-strip">
          <span class="hero-trust-item"><strong>★ ${SITE.gbp.ratingValue}</strong> (${SITE.gbp.reviewCount}+ avaliações no Google)</span>
          <span class="hero-trust-item"><strong>Carga de Gás A/C</strong> a partir de R$ 300</span>
          <span class="hero-trust-item"><strong>Scanner Automotivo</strong> R$ 150</span>
        </div>
      </div>

      <div class="hero-media-card">
        <picture>
          <source media="(max-width: 767px)" srcset="/assets/img/fachada-angelo-car-hero-720.webp" type="image/webp">
          <img
            src="/assets/img/fachada-angelo-car-hero.webp"
            alt="Fachada da Ângelo Car Oficina Mecânica na Av. Vicente Monteggia, 333 em Porto Alegre"
            width="1200"
            height="675"
            loading="eager"
            fetchpriority="high">
        </picture>
        <div class="hero-media-caption">
          <div class="caption-block">
            <span>Oficina Física</span>
            <strong>08h às 19h (Todos os dias)</strong>
          </div>
          <div class="caption-block">
            <span>Socorro Móvel</span>
            <strong>Plantão 24 Horas</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Grade Completa de Serviços com Links Internos SEO -->
  <section class="page-section" id="servicos">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Nossas Especialidades</span>
        <h2>Serviços Automotivos Completos em Porto Alegre</h2>
        <p>Escolha o serviço que você precisa para ver detalhes técnicos, sinais de alerta e solicitar orçamento direto com a oficina.</p>
      </div>
      <div class="services-grid">
        ${SERVICES.map(
          (s) => `
          <article class="service-card">
            <div>
              <span class="service-card-tag">${escapeHtml(s.tag)}</span>
              <h3><a href="/servicos/${s.slug}/">${escapeHtml(s.shortTitle)}</a></h3>
              <p>${escapeHtml(s.cardSummary)}</p>
            </div>
            <div class="service-card-footer">
              <a href="/servicos/${s.slug}/" class="service-card-link">Ver detalhes de ${escapeHtml(s.navTitle)} →</a>
              <a href="${buildWhatsappUrl(s.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" data-track="whatsapp_click" data-service="${s.slug}" data-location="home-card">WhatsApp</a>
            </div>
          </article>`
        ).join('')}
      </div>
    </div>
  </section>

  <!-- Diferenciais & Galeria Real da Oficina -->
  <section class="page-section page-section--white" id="estrutura">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Estrutura Real na Cavalhada</span>
        <h2>Oficina Física Estabelecida com Transparência de Verdade</h2>
        <p>Você fala diretamente com quem executa o serviço no seu carro. Conheça nossa estrutura na Av. Vicente Monteggia, 333.</p>
      </div>
      <div class="gallery-grid">
        ${SITE.gallery
          .map(
            (g) => `
          <figure class="gallery-item">
            <img src="${g.src}" alt="${escapeHtml(g.alt)}" width="${g.width}" height="${g.height}" loading="lazy">
            <figcaption>${escapeHtml(g.caption)}</figcaption>
          </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${renderReviewsSection()}
  ${renderLocationAndMapSection()}
  ${renderFaqSection(HOME_FAQS, 'Perguntas Frequentes sobre a Ângelo Car')}

  <!-- Orçamento + CTA Final -->
  <section class="page-section">
    <div class="container two-col-grid" style="align-items:start;">
      <div class="cta-banner" style="grid-template-columns:1fr;">
        <div>
          <span class="section-kicker">Atendimento Direto</span>
          <h2>Precisa de mecânico ou socorro 24h em Porto Alegre?</h2>
          <p>Fale agora com a equipe da Ângelo Car pelo WhatsApp ou telefone. Orçamento claro, sem surpresas e atendimento ágil na Zona Sul.</p>
        </div>
        <div class="cta-banner-actions">
          <a id="cta-whatsapp-footer-banner" href="${waHome}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="home" data-location="bottom-banner">Chamar no WhatsApp</a>
          <a id="cta-ligar-footer-banner" href="tel:${SITE.phoneHref}" class="btn btn-outline-dark" data-track="phone_call_click" data-service="home" data-location="bottom-banner">Ligar ${SITE.phoneDisplay}</a>
        </div>
      </div>
      ${renderQuoteForm({ defaultService: 'Socorro Mecânico 24h', formTitle: 'Solicite um orçamento rápido' })}
    </div>
  </section>`;

  const html = renderLayout({
    title: 'Ângelo Car Oficina Mecânica em Porto Alegre | Socorro 24h',
    description: 'Oficina mecânica na Cavalhada, Porto Alegre (Av. Vicente Monteggia, 333). Socorro 24h, ar-condicionado, motor, freios e scanner. Chame no WhatsApp.',
    canonicalPath: '/',
    currentNav: 'home',
    schemas: [buildFaqSchema(HOME_FAQS)],
    whatsappMessage: 'Olá Ângelo Car! Vim pelo site angelocar.com.br e gostaria de um orçamento.',
    serviceSlug: 'home',
    bodyHtml
  });

  writePage('index.html', html);
}

function buildServicePage(service) {
  const canonicalPath = `/servicos/${service.slug}/`;
  const waUrl = buildWhatsappUrl(service.whatsappMessage);
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Serviços', path: '/#servicos' },
    { name: service.shortTitle, path: canonicalPath }
  ];

  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  const bodyHtml = `
  ${renderBreadcrumb(breadcrumbs)}

  <!-- Hero com Message Match Direto para Google Ads -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="hero-eyebrow">${escapeHtml(service.heroBadge)}</span>
        <h1>${escapeHtml(service.h1)}</h1>
        <p class="hero-lead">${escapeHtml(service.heroLead)}</p>
        <div class="hero-cta-group">
          <a id="cta-whatsapp-hero" href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="${service.slug}" data-location="hero">
            Orçamento de ${escapeHtml(service.navTitle)} no WhatsApp
          </a>
          <a id="cta-ligar-hero" href="tel:${SITE.phoneHref}" class="btn btn-outline-dark" data-track="phone_call_click" data-service="${service.slug}" data-location="hero">
            Ligar ${SITE.phoneDisplay}
          </a>
        </div>
        <div class="hero-trust-strip">
          <span class="hero-trust-item"><strong>${escapeHtml(service.priceHighlight)}</strong></span>
          <span class="hero-trust-item"><strong>Av. Vicente Monteggia, 333</strong> — Cavalhada, POA</span>
        </div>
      </div>

      <div class="hero-media-card">
        <picture>
          <source media="(max-width: 767px)" srcset="${service.heroImageMobile}" type="image/webp">
          <img
            src="${service.heroImage}"
            alt="${escapeHtml(service.heroAlt)}"
            width="1200"
            height="675"
            loading="eager"
            fetchpriority="high">
        </picture>
        <div class="hero-media-caption">
          <div class="caption-block">
            <span>Avaliação Google</span>
            <strong>★ ${SITE.gbp.ratingValue} (${SITE.gbp.reviewCount}+ clientes)</strong>
          </div>
          <div class="caption-block">
            <span>Contato Direto</span>
            <strong>${SITE.phoneDisplay}</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Conteúdo Técnico Aprofundado (Sinais + Diferenciais) -->
  <section class="page-section">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Diagnóstico &amp; Execução</span>
        <h2>${escapeHtml(service.overviewTitle)}</h2>
        <p>${escapeHtml(service.overviewText)}</p>
      </div>
      <div class="two-col-grid">
        <article class="info-panel">
          <h3>Sinais de que seu carro precisa deste serviço</h3>
          <ul class="check-list">
            ${service.symptoms.map((item) => `<li><span class="check-icon" aria-hidden="true">✓</span><span>${escapeHtml(item)}</span></li>`).join('')}
          </ul>
        </article>
        <article class="info-panel">
          <h3>Por que fazer na ${escapeHtml(SITE.brandName)}</h3>
          <ul class="check-list">
            ${service.differentials.map((item) => `<li><span class="check-icon" aria-hidden="true">✓</span><span>${escapeHtml(item)}</span></li>`).join('')}
          </ul>
          <div style="margin-top:22px;display:flex;flex-wrap:wrap;gap:10px;">
            <a id="cta-whatsapp-mid" href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" data-track="whatsapp_click" data-service="${service.slug}" data-location="mid-section">Falar no WhatsApp Agora</a>
            <a id="cta-ligar-mid" href="tel:${SITE.phoneHref}" class="btn btn-outline-light btn-sm" data-track="phone_call_click" data-service="${service.slug}" data-location="mid-section">Ligar ${SITE.phoneDisplay}</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Etapas de Atendimento -->
  <section class="page-section page-section--white">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Como Funciona</span>
        <h2>Etapas do atendimento de ${escapeHtml(service.shortTitle)}</h2>
        <p>Processo objetivo, diagnóstico transparente e aprovação prévia de orçamento em todas as etapas.</p>
      </div>
      <div class="steps-grid">
        ${service.steps
          .map(
            (st, idx) => `
          <article class="step-card">
            <span class="step-num">0${idx + 1}</span>
            <h3>${escapeHtml(st.title)}</h3>
            <p>${escapeHtml(st.text)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Formulário Pré-configurado com o Serviço + Localização -->
  <section class="page-section">
    <div class="container two-col-grid" style="align-items:start;">
      ${renderQuoteForm({ defaultService: service.shortTitle, formTitle: `Orçamento de ${service.shortTitle}` })}
      <div class="info-panel">
        <h3>Atendimento na Cavalhada e toda Porto Alegre</h3>
        <p style="color:var(--ink-secondary);margin:0 0 14px;">
          Traga seu veículo diretamente à nossa oficina na <strong>${escapeHtml(SITE.address.full)}</strong> ou chame pelo WhatsApp para atendimento rápido.
        </p>
        <div class="map-frame-wrap" style="margin-bottom:16px;">
          <iframe
            title="Mapa da Ângelo Car para ${escapeHtml(service.shortTitle)} em Porto Alegre"
            src="${SITE.gbp.embedUrl}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen>
          </iframe>
        </div>
        <a href="${SITE.gbp.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-brand btn-sm" data-track="maps_route_click" data-service="${service.slug}" data-location="service-map">Traçar Rota no Google Maps</a>
      </div>
    </div>
  </section>

  ${renderFaqSection(service.faqs, `Perguntas Frequentes sobre ${service.shortTitle}`)}

  <!-- Links Internos Relacionados -->
  <section class="page-section">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Outros Serviços na Oficina</span>
        <h2>Veja também outros serviços da Ângelo Car</h2>
      </div>
      <div class="services-grid">
        ${related
          .map(
            (r) => `
          <article class="service-card">
            <div>
              <span class="service-card-tag">${escapeHtml(r.tag)}</span>
              <h3><a href="/servicos/${r.slug}/">${escapeHtml(r.shortTitle)}</a></h3>
              <p>${escapeHtml(r.cardSummary)}</p>
            </div>
            <div class="service-card-footer">
              <a href="/servicos/${r.slug}/" class="service-card-link">Acessar página de ${escapeHtml(r.navTitle)} →</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  const html = renderLayout({
    title: service.title,
    description: service.metaDescription,
    canonicalPath,
    currentNav: service.slug,
    ogImage: service.heroImage,
    schemas: [
      buildServiceSchema(service),
      buildFaqSchema(service.faqs),
      buildBreadcrumbSchema(breadcrumbs)
    ],
    whatsappMessage: service.whatsappMessage,
    serviceSlug: service.slug,
    bodyHtml
  });

  writePage(path.join('servicos', service.slug, 'index.html'), html);
}

function buildSobrePage() {
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Sobre a Oficina', path: '/sobre/' }
  ];

  const bodyHtml = `
  ${renderBreadcrumb(breadcrumbs)}
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="hero-eyebrow">Nossa História &amp; Estrutura</span>
        <h1>Sobre a ${escapeHtml(SITE.brandName)} em Porto Alegre</h1>
        <p class="hero-lead">
          Localizada na <strong>Av. Vicente Monteggia, 333 (Cavalhada)</strong>, a Ângelo Car une oficina mecânica presencial equipada com elevadores e plantão móvel 24 horas para atender motoristas de toda Porto Alegre com honestidade e agilidade.
        </p>
        <div class="hero-cta-group">
          <a id="cta-whatsapp-hero" href="${buildWhatsappUrl('Olá Ângelo Car! Gostaria de conhecer a oficina e agendar uma avaliação.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="sobre" data-location="hero">Falar no WhatsApp</a>
          <a href="${SITE.gbp.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark" data-track="maps_route_click" data-service="sobre" data-location="hero">Ver no Google Maps</a>
        </div>
      </div>
      <div class="hero-media-card">
        <img src="/assets/img/avenida-vicente-monteggia.webp" alt="Vista da Av. Vicente Monteggia, 333 onde fica a Ângelo Car Oficina Mecânica" width="960" height="720" loading="eager" fetchpriority="high">
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="container two-col-grid">
      <article class="info-panel">
        <h2>Compromisso com diagnóstico honesto</h2>
        <p style="color:var(--ink-secondary);">
          Na Ângelo Car, cada veículo é avaliado de forma objetiva antes de qualquer orçamento. Mostramos o defeito real, explicamos o que é prioridade de segurança e mantemos comunicação direta com o proprietário durante todo o serviço.
        </p>
        <p style="color:var(--ink-secondary);">
          <strong>Dados oficiais da empresa:</strong><br>
          Razão Social: ${escapeHtml(SITE.legalName)}<br>
          CNPJ: ${SITE.cnpj}<br>
          Endereço: ${escapeHtml(SITE.address.full)}<br>
          Telefones: ${SITE.phoneDisplay} / ${SITE.landlineDisplay}
        </p>
      </article>
      <article class="info-panel">
        <h2>Nossa Estrutura Física</h2>
        <ul class="check-list">
          <li><span class="check-icon" aria-hidden="true">✓</span><span>Elevadores automotivos para inspeção completa de freios, suspensão e motor</span></li>
          <li><span class="check-icon" aria-hidden="true">✓</span><span>Equipamento de carga de gás e diagnóstico de ar-condicionado automotivo</span></li>
          <li><span class="check-icon" aria-hidden="true">✓</span><span>Scanner automotivo profissional OBD-II com valor fixo de R$ 150</span></li>
          <li><span class="check-icon" aria-hidden="true">✓</span><span>Atendimento presencial todos os dias das 08h às 19h + Socorro 24h</span></li>
        </ul>
      </article>
    </div>
  </section>

  <section class="page-section page-section--white">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Fotos Reais</span>
        <h2>Conheça nosso pátio e área de atendimento</h2>
      </div>
      <div class="gallery-grid">
        ${SITE.gallery
          .map(
            (g) => `
          <figure class="gallery-item">
            <img src="${g.src}" alt="${escapeHtml(g.alt)}" width="${g.width}" height="${g.height}" loading="lazy">
            <figcaption>${escapeHtml(g.caption)}</figcaption>
          </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${renderReviewsSection()}`;

  writePage(
    'sobre/index.html',
    renderLayout({
      title: 'Sobre a Ângelo Car Oficina Mecânica | Porto Alegre',
      description: 'Conheça a Ângelo Car Oficina Mecânica na Av. Vicente Monteggia, 333, Cavalhada, Porto Alegre. CNPJ, estrutura com elevadores, horários e avaliações reais.',
      canonicalPath: '/sobre/',
      currentNav: 'sobre',
      schemas: [buildBreadcrumbSchema(breadcrumbs)],
      serviceSlug: 'sobre',
      bodyHtml
    })
  );
}

function buildContatoPage() {
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Contato', path: '/contato/' }
  ];

  const bodyHtml = `
  ${renderBreadcrumb(breadcrumbs)}
  <section class="hero" style="padding-block:38px 46px;">
    <div class="container">
      <span class="hero-eyebrow">Fale Direto com a Oficina</span>
      <h1>Contato e Localização — ${escapeHtml(SITE.brandName)}</h1>
      <p class="hero-lead">
        Atendimento rápido pelo WhatsApp <strong>${SITE.phoneDisplay}</strong>, ligação direta ou presencialmente na <strong>${escapeHtml(SITE.address.full)}</strong>.
      </p>
      <div class="hero-cta-group" style="max-width:560px;">
        <a id="cta-whatsapp-hero" href="${buildWhatsappUrl('Olá Ângelo Car! Vim pela página de contato do site angelocar.com.br.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="contato" data-location="hero">Abrir WhatsApp</a>
        <a id="cta-ligar-hero" href="tel:${SITE.phoneHref}" class="btn btn-outline-dark" data-track="phone_call_click" data-service="contato" data-location="hero">Ligar ${SITE.phoneDisplay}</a>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="container two-col-grid" style="align-items:start;">
      ${renderQuoteForm({ defaultService: 'Socorro Mecânico 24h', formTitle: 'Envie sua mensagem para o WhatsApp' })}
      <div class="info-panel">
        <h2>Canais Oficiais e Endereço (NAP)</h2>
        <p style="color:var(--ink-secondary);">
          <strong>Empresa:</strong> ${escapeHtml(SITE.brandName)}<br>
          <strong>Razão Social:</strong> ${escapeHtml(SITE.legalName)}<br>
          <strong>CNPJ:</strong> ${SITE.cnpj}<br>
          <strong>Endereço:</strong> ${escapeHtml(SITE.address.full)}<br>
          <strong>WhatsApp / Plantão 24h:</strong> <a href="tel:${SITE.phoneHref}" style="color:var(--accent-brand);font-weight:700;">${SITE.phoneDisplay}</a><br>
          <strong>Telefone Fixo:</strong> <a href="tel:${SITE.landlineHref}" style="font-weight:700;">${SITE.landlineDisplay}</a><br>
          <strong>E-mail:</strong> ${SITE.email}
        </p>
        <p style="color:var(--ink-secondary);">
          <strong>Oficina Física:</strong> ${escapeHtml(SITE.hours.workshopLabel)}<br>
          <strong>Socorro Mecânico:</strong> ${escapeHtml(SITE.hours.emergencyLabel)}
        </p>
        <div class="map-frame-wrap" style="margin-top:16px;">
          <iframe
            title="Localização da Ângelo Car Oficina Mecânica em Porto Alegre"
            src="${SITE.gbp.embedUrl}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
  </section>`;

  writePage(
    'contato/index.html',
    renderLayout({
      title: 'Contato e Endereço | Ângelo Car Oficina Porto Alegre',
      description: 'WhatsApp (51) 98428-1009, endereço Av. Vicente Monteggia, 333 - Cavalhada, Porto Alegre e mapa para chegar na Ângelo Car Oficina Mecânica.',
      canonicalPath: '/contato/',
      currentNav: 'contato',
      schemas: [buildBreadcrumbSchema(breadcrumbs)],
      serviceSlug: 'contato',
      bodyHtml
    })
  );
}

function buildPrivacyPage() {
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade/' }
  ];

  const bodyHtml = `
  ${renderBreadcrumb(breadcrumbs)}
  <section class="page-section">
    <div class="container">
      <article class="prose">
        <h1>Política de Privacidade</h1>
        <p><strong>Última atualização:</strong> Novembro de 2026</p>
        <p>
          A <strong>${escapeHtml(SITE.legalName)}</strong> (${escapeHtml(SITE.brandName)}), inscrita no CNPJ <strong>${SITE.cnpj}</strong>, localizada na ${escapeHtml(SITE.address.full)}, respeita a sua privacidade e atua em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
        </p>

        <h2>1. Dados coletados</h2>
        <p>
          Ao utilizar nosso formulário de orçamento ou clicar em nossos canais de WhatsApp e telefone, você pode fornecer voluntariamente dados como nome, número de telefone, modelo do veículo, bairro e descrição do problema mecânico. Nosso site também pode utilizar cookies técnicos e de medição de desempenho (como Google Analytics e Google Ads) para mensurar a eficácia de nossas campanhas e melhorar a experiência de navegação.
        </p>

        <h2>2. Finalidade do uso dos dados</h2>
        <ul>
          <li>Responder solicitações de orçamento, agendamento e despacho de socorro mecânico 24h;</li>
          <li>Comunicar status de diagnóstico, valores e conclusão de serviços automotivos;</li>
          <li>Medir conversões de anúncios e melhorar o desempenho técnico do site.</li>
        </ul>

        <h2>3. Compartilhamento e segurança</h2>
        <p>
          Não vendemos nem alugamos seus dados pessoais a terceiros. As informações enviadas pelo formulário são direcionadas diretamente para o atendimento oficial no WhatsApp da oficina (${SITE.phoneDisplay}).
        </p>

        <h2>4. Seus direitos (LGPD)</h2>
        <p>
          Você pode solicitar a confirmação, correção ou exclusão de seus dados pessoais a qualquer momento entrando em contato pelo e-mail <strong>${SITE.email}</strong> ou pelo telefone <strong>${SITE.phoneDisplay}</strong>.
        </p>
      </article>
    </div>
  </section>`;

  writePage(
    'politica-de-privacidade/index.html',
    renderLayout({
      title: 'Política de Privacidade | Ângelo Car Oficina Mecânica',
      description: 'Política de Privacidade e proteção de dados (LGPD) da Ângelo Car Oficina Mecânica em Porto Alegre.',
      canonicalPath: '/politica-de-privacidade/',
      schemas: [buildBreadcrumbSchema(breadcrumbs)],
      serviceSlug: 'privacidade',
      bodyHtml
    })
  );
}

function buildTermsPage() {
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Termos de Uso', path: '/termos-de-uso/' }
  ];

  const bodyHtml = `
  ${renderBreadcrumb(breadcrumbs)}
  <section class="page-section">
    <div class="container">
      <article class="prose">
        <h1>Termos de Uso</h1>
        <p><strong>Última atualização:</strong> Novembro de 2026</p>
        <p>
          Ao acessar o site <strong>angelocar.com.br</strong>, mantido por <strong>${escapeHtml(SITE.legalName)}</strong> (CNPJ ${SITE.cnpj}), você concorda com os termos abaixo.
        </p>

        <h2>1. Informações e orçamentos</h2>
        <p>
          As informações publicadas neste site têm caráter informativo sobre os serviços prestados pela ${escapeHtml(SITE.brandName)}. Valores de referência (como scanner automotivo a R$ 150,00 ou carga de gás de ar-condicionado a partir de R$ 300,00) podem variar conforme modelo do veículo, necessidade de peças adicionais ou diagnóstico presencial. Nenhum serviço é executado sem aprovação prévia do cliente.
        </p>

        <h2>2. Escopo de atendimento</h2>
        <p>
          Atendemos veículos de passeio e utilitários leves na área de mecânica geral, motor, freios, suspensão, ar-condicionado automotivo, diagnóstico por scanner e socorro mecânico 24h em Porto Alegre. Serviços fora de nosso escopo (como borracharia/pneus, geometria ou câmbio automático) são informados com transparência antes do atendimento.
        </p>

        <h2>3. Propriedade intelectual e contato</h2>
        <p>
          Textos, marcas e fotografias da oficina exibidos neste site pertencem à ${escapeHtml(SITE.brandName)}. Dúvidas podem ser encaminhadas para <strong>${SITE.email}</strong> ou pelo telefone <strong>${SITE.phoneDisplay}</strong>.
        </p>
      </article>
    </div>
  </section>`;

  writePage(
    'termos-de-uso/index.html',
    renderLayout({
      title: 'Termos de Uso | Ângelo Car Oficina Mecânica',
      description: 'Termos de Uso do site oficial da Ângelo Car Oficina Mecânica (angelocar.com.br).',
      canonicalPath: '/termos-de-uso/',
      schemas: [buildBreadcrumbSchema(breadcrumbs)],
      serviceSlug: 'termos',
      bodyHtml
    })
  );
}

function buildSitemapAndRobots() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    ...SERVICES.map((s) => ({ path: `/servicos/${s.slug}/`, priority: '0.9', changefreq: 'weekly' })),
    { path: '/sobre/', priority: '0.7', changefreq: 'monthly' },
    { path: '/contato/', priority: '0.8', changefreq: 'monthly' },
    { path: '/politica-de-privacidade/', priority: '0.3', changefreq: 'yearly' },
    { path: '/termos-de-uso/', priority: '0.3', changefreq: 'yearly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE.domain}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const robots = `User-agent: *
Allow: /
Disallow: /src/
Disallow: /scripts/

Sitemap: ${SITE.domain}/sitemap.xml
`;

  writePage('sitemap.xml', sitemap);
  writePage('robots.txt', robots);
}

// Run full build
buildHomePage();
for (const service of SERVICES) {
  buildServicePage(service);
}
buildSobrePage();
buildContatoPage();
buildPrivacyPage();
buildTermsPage();
buildSitemapAndRobots();
console.log('Build complete: 12 pages + sitemap.xml + robots.txt generated!');
