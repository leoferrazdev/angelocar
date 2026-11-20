import { SITE, buildWhatsappUrl } from '../data/site.mjs';
import { SERVICES } from '../data/services.mjs';

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE.domain}/#autorepair`,
    name: SITE.brandName,
    legalName: SITE.legalName,
    url: SITE.domain,
    logo: `${SITE.domain}/assets/img/logo-angelo-car.webp`,
    image: [
      `${SITE.domain}/assets/img/fachada-angelo-car-hero.webp`,
      `${SITE.domain}/assets/img/interior-elevadores-oficina.webp`,
      `${SITE.domain}/assets/img/rampa-acesso-oficina.webp`
    ],
    telephone: SITE.phoneHref,
    email: SITE.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude
    },
    hasMap: SITE.gbp.mapsUrl,
    areaServed: [
      { '@type': 'City', name: 'Porto Alegre' },
      ...SITE.neighborhoods.map((n) => ({
        '@type': 'Place',
        name: `${n}, Porto Alegre - RS`
      }))
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.gbp.ratingValue,
      reviewCount: SITE.gbp.reviewCount
    },
    sameAs: [SITE.gbp.mapsUrl]
  };
}

export function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

export function buildServiceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.shortTitle} em Porto Alegre`,
    description: service.metaDescription,
    serviceType: service.shortTitle,
    provider: {
      '@id': `${SITE.domain}/#autorepair`
    },
    areaServed: {
      '@type': 'City',
      name: 'Porto Alegre'
    },
    url: `${SITE.domain}/servicos/${service.slug}/`
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`
    }))
  };
}

export function renderBreadcrumb(items) {
  if (!items || items.length <= 1) return '';
  return `
  <nav class="breadcrumb" aria-label="Navegação estrutural">
    <div class="container">
      <ol>
        ${items
          .map((item, i) => {
            const isLast = i === items.length - 1;
            const sep = i > 0 ? '<li class="breadcrumb-sep" aria-hidden="true">/</li>' : '';
            if (isLast) {
              return `${sep}<li aria-current="page"><strong>${escapeHtml(item.name)}</strong></li>`;
            }
            return `${sep}<li><a href="${item.path}">${escapeHtml(item.name)}</a></li>`;
          })
          .join('')}
      </ol>
    </div>
  </nav>`;
}

export function renderQuoteForm({ defaultService = 'Socorro Mecânico 24h', formTitle = 'Peça seu orçamento rápido pelo WhatsApp' } = {}) {
  const options = SERVICES.map(
    (s) =>
      `<option value="${escapeHtml(s.shortTitle)}"${s.shortTitle === defaultService ? ' selected' : ''}>${escapeHtml(s.shortTitle)}</option>`
  ).join('');

  return `
  <div class="info-panel">
    <h3>${escapeHtml(formTitle)}</h3>
    <p style="margin:0 0 18px;color:var(--ink-secondary);font-size:0.94rem;">
      Preencha os dados abaixo e enviamos sua mensagem pronta direto para o WhatsApp da oficina <strong>${SITE.phoneDisplay}</strong>.
    </p>
    <form id="form-orcamento" class="quote-form" data-service="${escapeHtml(defaultService)}">
      <div class="form-field">
        <label for="campo-nome">Seu nome</label>
        <input id="campo-nome" name="nome" type="text" required autocomplete="name" placeholder="Ex.: Carlos Silva">
      </div>
      <div class="form-field">
        <label for="campo-telefone">WhatsApp / Telefone</label>
        <input id="campo-telefone" name="telefone" type="tel" required autocomplete="tel" placeholder="(51) 99999-9999">
      </div>
      <div class="form-field">
        <label for="campo-servico">Serviço desejado</label>
        <select id="campo-servico" name="servico">
          ${options}
          <option value="Outro serviço mecânico">Outro serviço mecânico</option>
        </select>
      </div>
      <div class="form-field">
        <label for="campo-veiculo">Veículo (modelo e ano)</label>
        <input id="campo-veiculo" name="veiculo" type="text" placeholder="Ex.: Onix 2019 1.4">
      </div>
      <div class="form-field">
        <label for="campo-bairro">Bairro em Porto Alegre</label>
        <input id="campo-bairro" name="bairro" type="text" placeholder="Ex.: Cavalhada, Tristeza, Camaquã...">
      </div>
      <div class="form-field">
        <label for="campo-mensagem">O que está acontecendo com o carro?</label>
        <textarea id="campo-mensagem" name="mensagem" placeholder="Descreva rapidamente o sintoma ou dúvida..."></textarea>
      </div>
      <button id="btn-enviar-orcamento" type="submit" class="btn btn-whatsapp" data-track="form_submit_click" data-service="${escapeHtml(defaultService)}" data-location="form-orcamento">
        Enviar para o WhatsApp Agora
      </button>
      <p class="form-note">Seus dados são usados apenas para atendimento do orçamento. Leia nossa <a href="/politica-de-privacidade/" style="text-decoration:underline;">Política de Privacidade</a>.</p>
    </form>
  </div>`;
}

export function renderFaqSection(faqs, title = 'Perguntas Frequentes') {
  return `
  <section class="page-section page-section--white" id="faq">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Tire suas dúvidas</span>
        <h2>${escapeHtml(title)}</h2>
        <p>Respostas diretas sobre atendimento, valores, horários e serviços executados na oficina.</p>
      </div>
      <div class="faq-list">
        ${faqs
          .map(
            (item, idx) => `
          <details class="faq-item"${idx === 0 ? ' open' : ''}>
            <summary>${escapeHtml(item.q)}</summary>
            <div class="faq-answer">${escapeHtml(item.a)}</div>
          </details>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

export function renderLocationAndMapSection() {
  return `
  <section class="page-section" id="localizacao">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Localização &amp; Área de Atendimento</span>
        <h2>Oficina Mecânica na Cavalhada, Zona Sul de Porto Alegre</h2>
        <p>Fácil acesso pela Av. Vicente Monteggia com pátio próprio, elevadores e deslocamento rápido para toda Porto Alegre.</p>
      </div>
      <div class="two-col-grid">
        <div class="info-panel">
          <h3>Como chegar na ${escapeHtml(SITE.brandName)}</h3>
          <p style="margin:0 0 12px;color:var(--ink-secondary);">
            <strong>Endereço:</strong> ${escapeHtml(SITE.address.full)}<br>
            <strong>WhatsApp / Plantão 24h:</strong> <a href="tel:${SITE.phoneHref}" style="color:var(--accent-brand);font-weight:700;" data-track="phone_call_click" data-location="localizacao">${SITE.phoneDisplay}</a><br>
            <strong>Telefone Fixo:</strong> <a href="tel:${SITE.landlineHref}" style="font-weight:700;" data-track="phone_call_click" data-location="localizacao-fixo">${SITE.landlineDisplay}</a><br>
            <strong>Oficina Física:</strong> ${escapeHtml(SITE.hours.workshopLabel)}<br>
            <strong>Socorro Móvel:</strong> ${escapeHtml(SITE.hours.emergencyLabel)}
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 20px;">
            <a id="cta-rotas-maps" href="${SITE.gbp.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-brand btn-sm" data-track="maps_route_click" data-location="localizacao">Abrir Rota no Google Maps</a>
            <a id="cta-avaliar-google" href="${SITE.gbp.reviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm" data-track="gbp_review_click" data-location="localizacao">Avaliar no Google ★★★★★</a>
          </div>
          <h4 style="margin:0 0 6px;font-size:0.95rem;color:var(--ink-primary);">Bairros atendidos em Porto Alegre:</h4>
          <ul class="neighborhood-chips">
            ${SITE.neighborhoods.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
        </div>
        <div class="map-frame-wrap">
          <iframe
            title="Mapa da Ângelo Car Oficina Mecânica na Av. Vicente Monteggia, 333 - Cavalhada, Porto Alegre"
            src="${SITE.gbp.embedUrl}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
  </section>`;
}

export function renderReviewsSection() {
  return `
  <section class="page-section page-section--white" id="avaliacoes">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Prova Social Local</span>
        <h2>Mais de ${SITE.gbp.reviewCount} avaliações reais de motoristas no Google</h2>
        <p>Confiança construída no atendimento diário na Cavalhada e nos atendimentos de socorro 24h em Porto Alegre.</p>
      </div>
      <div class="reviews-summary">
        <div class="rating-score">
          <span class="rating-number">${SITE.gbp.ratingValue}</span>
          <div>
            <div class="rating-stars" aria-label="Avaliação ${SITE.gbp.ratingValue} de 5 estrelas">★★★★☆</div>
            <div style="font-size:0.9rem;color:var(--ink-secondary);">Baseado em <strong>${SITE.gbp.reviewCount}+ avaliações</strong> no Perfil da Empresa no Google</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          <a href="${SITE.gbp.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm" data-track="gbp_profile_click" data-location="reviews">Ver Avaliações no Google</a>
          <a href="${SITE.gbp.reviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-brand btn-sm" data-track="gbp_review_click" data-location="reviews">Deixar Avaliação</a>
        </div>
      </div>
      <div class="reviews-grid">
        ${SITE.reviews
          .map(
            (r) => `
          <article class="review-card">
            <div class="rating-stars" style="font-size:1rem;" aria-hidden="true">★★★★★</div>
            <blockquote>"${escapeHtml(r.text)}"</blockquote>
            <div class="review-author">${escapeHtml(r.author)}</div>
            <div style="font-size:0.82rem;color:var(--ink-muted);">${escapeHtml(r.service)}</div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

export function renderLayout({
  title,
  description,
  canonicalPath,
  currentNav = '',
  ogImage = '/assets/img/fachada-angelo-car-hero.webp',
  schemas = [],
  whatsappMessage = 'Olá Ângelo Car! Vim pelo site angelocar.com.br e gostaria de um orçamento.',
  serviceSlug = 'geral',
  bodyHtml
}) {
  const canonicalUrl = `${SITE.domain}${canonicalPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE.domain}${ogImage}`;
  const waFloatUrl = buildWhatsappUrl(whatsappMessage);

  const navItems = [
    { href: '/', label: 'Início', key: 'home' },
    { href: '/servicos/socorro-mecanico-24h/', label: 'Socorro 24h', key: 'socorro-mecanico-24h' },
    { href: '/servicos/ar-condicionado-automotivo/', label: 'Ar-Condicionado', key: 'ar-condicionado-automotivo' },
    { href: '/servicos/retifica-e-conserto-de-motor/', label: 'Motor e Retífica', key: 'retifica-e-conserto-de-motor' },
    { href: '/servicos/mecanica-geral-e-revisao/', label: 'Oficina Geral', key: 'mecanica-geral-e-revisao' },
    { href: '/sobre/', label: 'Sobre', key: 'sobre' },
    { href: '/contato/', label: 'Contato', key: 'contato' }
  ];

  const allSchemas = [buildLocalBusinessSchema(), ...schemas];
  const schemaTags = allSchemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n  ');

  const gtmHead = SITE.tracking.gtmId
    ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${SITE.tracking.gtmId}');</script>`
    : '';

  const gtagId = SITE.tracking.googleAdsId || SITE.tracking.ga4Id;
  const gtagHead = gtagId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${gtagId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    ${SITE.tracking.googleAdsId ? `gtag('config', '${SITE.tracking.googleAdsId}');` : ''}
    ${SITE.tracking.ga4Id ? `gtag('config', '${SITE.tracking.ga4Id}');` : ''}
  </script>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <meta name="theme-color" content="#0F172A">

  <!-- Open Graph & Twitter Cards -->
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(SITE.brandName)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${fullOgImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${fullOgImage}">

  <!-- Typography Performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/styles.css">
  ${gtmHead}
  ${gtagHead}
  ${schemaTags}
</head>
<body>
  <a href="#conteudo-principal" class="sr-only">Pular para o conteúdo principal</a>

  <!-- Barra de Status Operacional -->
  <div class="top-status-bar">
    <div class="container top-status-inner">
      <div class="status-pill">
        <span class="status-dot" aria-hidden="true"></span>
        <span>Oficina: 08h–19h (todos os dias) • Plantão Socorro 24h</span>
      </div>
      <div class="top-status-links">
        <span>Av. Vicente Monteggia, 333 — Cavalhada, Porto Alegre</span>
        <a id="cta-ligar-topbar" href="tel:${SITE.phoneHref}" data-track="phone_call_click" data-service="${escapeHtml(serviceSlug)}" data-location="topbar">☎ ${SITE.phoneDisplay}</a>
      </div>
    </div>
  </div>

  <!-- Cabeçalho Principal -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-link" aria-label="${escapeHtml(SITE.brandName)} — Página inicial">
        <img src="/assets/img/logo-angelo-car.webp" alt="Logotipo ${escapeHtml(SITE.brandName)}" width="46" height="46" class="brand-logo" loading="eager">
        <span class="brand-text">
          <span class="brand-name">Ângelo Car</span>
          <span class="brand-sub">Oficina Mecânica • Porto Alegre</span>
        </span>
      </a>

      <nav class="nav-desktop" aria-label="Navegação principal">
        ${navItems
          .map(
            (item) =>
              `<a href="${item.href}"${currentNav === item.key ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
          )
          .join('')}
      </nav>

      <div class="header-actions">
        <a id="cta-whatsapp-header" href="${waFloatUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" data-track="whatsapp_click" data-service="${escapeHtml(serviceSlug)}" data-location="header">
          WhatsApp
        </a>
        <button id="menu-toggle" type="button" class="menu-toggle" aria-expanded="false" aria-controls="nav-mobile" aria-label="Abrir menu de navegação">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <nav id="nav-mobile" class="nav-mobile" aria-label="Menu móvel">
      <ul class="nav-mobile-list">
        ${navItems.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('')}
        <li><a href="/servicos/freios-e-suspensao/">Freios e Suspensão</a></li>
        <li><a href="/servicos/scanner-e-injecao-eletronica/">Scanner e Injeção (R$ 150)</a></li>
        <li><a href="/servicos/troca-de-oleo-e-filtros/">Troca de Óleo e Filtros</a></li>
      </ul>
      <div style="display:grid;gap:10px;">
        <a id="cta-whatsapp-mobile-menu" href="${waFloatUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" data-track="whatsapp_click" data-service="${escapeHtml(serviceSlug)}" data-location="mobile-menu">Chamar no WhatsApp ${SITE.phoneDisplay}</a>
        <a id="cta-ligar-mobile-menu" href="tel:${SITE.phoneHref}" class="btn btn-brand" data-track="phone_call_click" data-service="${escapeHtml(serviceSlug)}" data-location="mobile-menu">Ligar Agora ${SITE.phoneDisplay}</a>
      </div>
    </nav>
  </header>

  <main id="conteudo-principal">
    ${bodyHtml}
  </main>

  <!-- Rodapé com NAP Consistente e Conformidade Google Ads -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="nap-block">
          <h2 class="footer-heading">${escapeHtml(SITE.brandName)}</h2>
          <p><strong>Razão Social:</strong> ${escapeHtml(SITE.legalName)}</p>
          <p><strong>CNPJ:</strong> ${SITE.cnpj}</p>
          <p><strong>Endereço:</strong> ${escapeHtml(SITE.address.full)}</p>
          <p><strong>WhatsApp / Plantão 24h:</strong> <a href="tel:${SITE.phoneHref}" data-track="phone_call_click" data-location="footer">${SITE.phoneDisplay}</a></p>
          <p><strong>Fixo:</strong> <a href="tel:${SITE.landlineHref}" data-track="phone_call_click" data-location="footer-fixo">${SITE.landlineDisplay}</a></p>
        </div>

        <div>
          <h2 class="footer-heading">Serviços</h2>
          <ul class="footer-links">
            ${SERVICES.map((s) => `<li><a href="/servicos/${s.slug}/">${escapeHtml(s.shortTitle)}</a></li>`).join('')}
          </ul>
        </div>

        <div>
          <h2 class="footer-heading">Institucional</h2>
          <ul class="footer-links">
            <li><a href="/">Página Inicial</a></li>
            <li><a href="/sobre/">Sobre a Oficina</a></li>
            <li><a href="/contato/">Contato e Localização</a></li>
            <li><a href="${SITE.gbp.mapsUrl}" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a></li>
            <li><a href="${SITE.gbp.reviewUrl}" target="_blank" rel="noopener noreferrer">Avaliar no Google</a></li>
          </ul>
        </div>

        <div>
          <h2 class="footer-heading">Horários</h2>
          <p style="margin:0 0 10px;font-size:0.92rem;"><strong>Oficina Física:</strong><br>${escapeHtml(SITE.hours.workshopLabel)}</p>
          <p style="margin:0 0 10px;font-size:0.92rem;"><strong>Socorro Mecânico:</strong><br>${escapeHtml(SITE.hours.emergencyLabel)}</p>
          <p style="margin:0;font-size:0.92rem;"><strong>Ar-Condicionado:</strong><br>${escapeHtml(SITE.hours.airConditioningLabel)}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 ${escapeHtml(SITE.brandName)} — Todos os direitos reservados.</div>
        <div class="footer-legal-links">
          <a href="/politica-de-privacidade/">Política de Privacidade</a>
          <a href="/termos-de-uso/">Termos de Uso</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Botão Flutuante de WhatsApp -->
  <a id="cta-whatsapp-float" href="${waFloatUrl}" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="Chamar Ângelo Car no WhatsApp" data-track="whatsapp_click" data-service="${escapeHtml(serviceSlug)}" data-location="floating-button">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L0 24l6.32-1.66a11.87 11.87 0 0 0 5.74 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42zM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.87 9.87 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/>
    </svg>
    <span>WhatsApp</span>
  </a>

  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}
