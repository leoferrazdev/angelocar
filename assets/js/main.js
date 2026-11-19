/* ==========================================================================
   Ângelo Car Oficina Mecânica — Lightweight UX & Conversion Tracking Layer
   Zero external dependencies | GTM / GA4 / Google Ads Enhanced Conversions Ready
   ========================================================================== */

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  // Persist Google Ads / UTM attribution parameters in sessionStorage
  function captureAttribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var found = {};
    keys.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        found[key] = val;
        try {
          sessionStorage.setItem('ac_' + key, val);
        } catch (_) {}
      }
    });
    return found;
  }

  function getAttribution() {
    var keys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var data = {};
    keys.forEach(function (key) {
      try {
        var v = sessionStorage.getItem('ac_' + key);
        if (v) data[key] = v;
      } catch (_) {}
    });
    return data;
  }

  function trackEvent(eventName, payload) {
    var eventObj = Object.assign(
      {
        event: eventName,
        page_path: window.location.pathname,
        page_title: document.title
      },
      getAttribution(),
      payload || {}
    );

    window.dataLayer.push(eventObj);

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventObj);
    }
  }

  // Mobile menu toggle
  function initMobileNav() {
    var toggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('nav-mobile');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Track all semantic CTA clicks (WhatsApp, Phone Call, Maps Route)
  function initCtaTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a[data-track], button[data-track]');
      if (!target) return;

      var action = target.getAttribute('data-track');
      var service = target.getAttribute('data-service') || 'geral';
      var location = target.getAttribute('data-location') || target.id || 'page';

      trackEvent(action, {
        cta_id: target.id || '',
        service_name: service,
        cta_location: location,
        link_url: target.getAttribute('href') || ''
      });
    });
  }

  // Quote Form -> Fires conversion event + Opens pre-filled WhatsApp
  function initQuoteForm() {
    var form = document.getElementById('form-orcamento');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = (form.querySelector('[name="nome"]') || {}).value || '';
      var telefone = (form.querySelector('[name="telefone"]') || {}).value || '';
      var veiculo = (form.querySelector('[name="veiculo"]') || {}).value || '';
      var servico = (form.querySelector('[name="servico"]') || {}).value || 'Atendimento na Oficina';
      var mensagem = (form.querySelector('[name="mensagem"]') || {}).value || '';
      var bairro = (form.querySelector('[name="bairro"]') || {}).value || '';

      trackEvent('generate_lead', {
        lead_source: 'form_orcamento_whatsapp',
        service_name: servico,
        vehicle: veiculo,
        neighborhood: bairro
      });

      var lines = [
        'Olá Ângelo Car! Vim pelo site angelocar.com.br e preciso de atendimento:',
        '*Serviço:* ' + servico
      ];
      if (nome.trim()) lines.push('*Nome:* ' + nome.trim());
      if (telefone.trim()) lines.push('*Telefone:* ' + telefone.trim());
      if (veiculo.trim()) lines.push('*Veículo:* ' + veiculo.trim());
      if (bairro.trim()) lines.push('*Bairro:* ' + bairro.trim());
      if (mensagem.trim()) lines.push('*Problema/Dúvida:* ' + mensagem.trim());

      var waUrl = 'https://wa.me/5551984281009?text=' + encodeURIComponent(lines.join('\n'));
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  captureAttribution();
  initMobileNav();
  initCtaTracking();
  initQuoteForm();
})();
