(function () {
  var ENDPOINT = 'https://leobrasil.com.br/api/v1/track/whatsapp';
  var CLIENT_SLUG = 'angelo-car';
  var STORAGE_KEY = 'lb_attribution_v1';

  try {
    var params = new URLSearchParams(window.location.search);
    var fresh = {
      gclid: params.get('gclid') || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || ''
    };
    if (fresh.gclid || fresh.utmSource || fresh.utmMedium || fresh.utmCampaign) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  } catch (_) {}

  function getAttribution() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  document.addEventListener('click', function (ev) {
    var anchor = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!anchor) return;
    var href = anchor.getAttribute('href') || '';
    if (!/(wa\.me|api\.whatsapp\.com|whatsapp\.com\/send)/i.test(href)) return;

    var attr = getAttribution();
    var payload = JSON.stringify({
      clientSlug: CLIENT_SLUG,
      pagePath: window.location.pathname || '/',
      ctaLabel: (anchor.textContent || anchor.getAttribute('aria-label') || 'WhatsApp').trim().slice(0, 120),
      utmSource: attr.utmSource || null,
      utmMedium: attr.utmMedium || null,
      utmCampaign: attr.utmCampaign || null,
      gclid: attr.gclid || null,
      userAgentType: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    });

    if (navigator.sendBeacon) {
      var blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
    }
  });
})();
