/**
 * ═══════════════════════════════════════════════════════════
 * MASCOLOR CRO ENGINE v1.0
 * ═══════════════════════════════════════════════════════════
 * 
 * 4 features PRO para landings de Google Ads:
 * 1. DTR  — Dynamic Text Replacement (H1 cambia por keyword)
 * 3. TOAST — Social Proof Notifications (nombres reales)
 * 4. UTM  — WhatsApp message includes campaign reference
 * 
 * USO: incluir mascolor-cro-engine.js antes de cerrar body
 * Solo eso. Se auto-inicializa al cargar.
 * 
 * CONFIGURACIÓN: editar MASCOLOR_CRO.config al final del archivo
 * ═══════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  var CONFIG = {
    // ── PHONES ──
    phones: {
      bogota: '573123725256',
      medellin: '573043483816'
    },
    defaultPhone: '573123725256',

    // ── DTR: Dynamic Text Replacement ──
    // Maps URL params/keywords to H1 text
    // Checks: ?keyword=, ?utm_term=, ?utm_campaign=, or URL path
    dtr: {
      enabled: true,
      selector: '[data-dtr="headline"]', // Element to replace
      fallback: 'Obtén tapetes publicitarios a costo de fábrica y con calidad garantizada',
      rules: [
        { match: ['tapetes publicitarios', 'Tapetes-Publicitarios', 'tapetes-publicitarios'], text: 'Obtén tapetes publicitarios a <em>costo de fábrica</em> y con calidad garantizada' },
        { match: ['tapetes con logo', 'tapetes+con+logo', 'tapetes-con-logo'], text: 'Tapetes con <em>tu logo</em> a costo de fábrica y con calidad garantizada' },
        { match: ['tapetes personalizados', 'tapetes-personalizados'], text: 'Tapetes personalizados con <em>tu marca</em> a costo de fábrica' },
        { match: ['tapetes atrapamugre', 'tapetes-atrapa-mugre', 'atrapamugre'], text: 'Tapetes atrapamugre con <em>tu logo</em> — fábrica directa' },
        { match: ['tapetes atrapahumedad', 'Tapetes-Zona-Humedas', 'atrapa-humedad'], text: 'Tapetes atrapahumedad con <em>tu logo</em> — absorbe hasta 7L/m²' },
        { match: ['tapetes antifatiga', 'Tapetes-Antifatiga'], text: 'Tapetes antifatiga — menos fatiga, más <em>productividad</em>' },
        { match: ['tapetes bogota', 'tapetes-bogota', 'tapetes bogotá'], text: 'Tapetes con logo en <em>Bogotá</em> — fábrica + envío gratis' },
        { match: ['tapetes medellin', 'tapetes-medellin', 'tapetes medellín'], text: 'Tapetes con logo en <em>Medellín</em> — sede local + visitas' },
        { match: ['fabrica de tapetes', 'fabrica-de-tapetes'], text: '<em>Fábrica de tapetes</em> publicitarios — precio directo' },
        { match: ['tapetes para conjuntos', 'tapetes-conjuntos'], text: 'Tapetes para <em>conjuntos residenciales</em> — lobby, ascensores, pasillos' },
        { match: ['tapetes para ascensores', 'tapetes-ascensores'], text: 'Tapetes para <em>ascensores</em> — caucho, atrapamugre, atrapahumedad' }
      ]
    },

    // ── SOCIAL PROOF TOAST ──
    toast: {
      enabled: true,
      delay: 8000,           // First toast after 8s
      interval: 25000,       // Next toast every 25s
      duration: 5000,        // Each toast visible for 5s
      maxShows: 3,           // Max 3 toasts per session
      // Real data from yclaud Excel
      entries: [
        { name: 'Maria del Pilar', city: 'Bogotá', action: 'cotizó tapetes con logo', time: '3 min' },
        { name: 'Erick C.', city: 'Bogotá', action: 'pidió diseño gratis', time: '7 min' },
        { name: 'Patricia R.', city: 'Bogotá', action: 'cotizó tapetes atrapamugre', time: '12 min' },
        { name: 'Batermax SAS', city: 'Bogotá', action: 'realizó un pedido', time: '18 min' },
        { name: 'Mauricio V.', city: 'Medellín', action: 'cotizó tapetes con logo', time: '25 min' },
        { name: 'Jader B.', city: 'Bogotá', action: 'pidió diseño gratis', time: '32 min' },
        { name: 'Tesauros', city: 'Bogotá', action: 'realizó un pedido', time: '45 min' },
        { name: 'Neider S.', city: 'Bogotá', action: 'cotizó tapetes para empresa', time: '1 hora' },
        { name: 'Jimmy', city: 'Medellín', action: 'pidió diseño gratis', time: '1 hora' },
        { name: 'Inter Rapidísimo', city: 'Bogotá', action: 'realizó un pedido', time: '2 horas' }
      ]
    },

    // ── UTM → WHATSAPP ──
    utm: {
      enabled: true,
      defaultMessage: 'Hola, quiero cotizar un tapete con logo.',
      selector: '[data-wa]' // All WA links get UTM appended
    },

    // ── TRACKING ──
    tracking: {
      adsId: 'AW-10786170838',
      ga4Id: 'G-8SG6L9QLZY',
      conversionValue: 321906,
      currency: 'COP'
    }
  };


  // ═══════════════════════════════════════
  // 1. DTR — Dynamic Text Replacement
  // ═══════════════════════════════════════
  function initDTR() {
    if (!CONFIG.dtr.enabled) return;

    var el = document.querySelector(CONFIG.dtr.selector);
    if (!el) return;

    // Get keyword from URL params
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('keyword') || params.get('utm_term') || params.get('utm_campaign') || '';
    
    // Also check URL path
    var path = window.location.pathname.toLowerCase();

    // Find matching rule
    var matched = false;
    for (var i = 0; i < CONFIG.dtr.rules.length; i++) {
      var rule = CONFIG.dtr.rules[i];
      for (var j = 0; j < rule.match.length; j++) {
        var term = rule.match[j].toLowerCase();
        if (keyword.toLowerCase().indexOf(term) !== -1 || path.indexOf(term) !== -1) {
          el.innerHTML = rule.text;
          matched = true;
          // Track DTR match
          if (typeof gtag !== 'undefined') {
            gtag('event', 'dtr_match', { keyword: term, page: path });
          }
          break;
        }
      }
      if (matched) break;
    }
  }


  // ═══════════════════════════════════════
  // 3. SOCIAL PROOF TOAST
  // ═══════════════════════════════════════
  function initToast() {
    if (!CONFIG.toast.enabled) return;

    // Inject CSS
    var css = document.createElement('style');
    css.textContent = [
      '.mc-toast{position:fixed;bottom:80px;left:20px;background:#fff;border-radius:14px;padding:14px 18px;box-shadow:0 8px 32px rgba(0,0,0,.15);display:flex;align-items:center;gap:12px;z-index:998;max-width:340px;transform:translateX(-120%);transition:transform .4s cubic-bezier(.68,-.55,.27,1.55);border:1px solid #e0e2e6}',
      '.mc-toast.show{transform:translateX(0)}',
      '.mc-toast-icon{width:36px;height:36px;border-radius:50%;background:#059669;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}',
      '.mc-toast-text{font-family:"Outfit",sans-serif;font-size:13px;color:#6b7280;line-height:1.4}',
      '.mc-toast-text strong{color:#0f1d4a;display:block;font-size:14px}',
      '.mc-toast-time{font-size:11px;color:#ED951E;font-weight:600}',
      '@media(max-width:480px){.mc-toast{bottom:72px;left:12px;right:12px;max-width:none}}'
    ].join('');
    document.head.appendChild(css);

    var toast = document.createElement('div');
    toast.className = 'mc-toast';
    toast.innerHTML = '<div class="mc-toast-icon">✓</div><div class="mc-toast-text"><strong></strong><span></span><div class="mc-toast-time"></div></div>';
    document.body.appendChild(toast);

    var entries = CONFIG.toast.entries.slice();
    var showCount = 0;

    // Shuffle
    for (var i = entries.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = entries[i]; entries[i] = entries[j]; entries[j] = temp;
    }

    function showToast() {
      if (showCount >= CONFIG.toast.maxShows || showCount >= entries.length) return;

      var entry = entries[showCount];
      toast.querySelector('strong').textContent = entry.name + ' de ' + entry.city;
      toast.querySelector('span').textContent = ' ' + entry.action;
      toast.querySelector('.mc-toast-time').textContent = 'Hace ' + entry.time;

      toast.classList.add('show');
      mcTrack('toast_shown', { name: entry.name });

      setTimeout(function() {
        toast.classList.remove('show');
      }, CONFIG.toast.duration);

      showCount++;

      if (showCount < CONFIG.toast.maxShows) {
        setTimeout(showToast, CONFIG.toast.interval);
      }
    }

    setTimeout(showToast, CONFIG.toast.delay);
  }


  // ═══════════════════════════════════════
  // 4. UTM → WHATSAPP
  // ═══════════════════════════════════════
  function initUTM() {
    if (!CONFIG.utm.enabled) return;

    var params = new URLSearchParams(window.location.search);
    var source = params.get('utm_source') || params.get('gad_source') || 'direct';
    var campaign = params.get('utm_campaign') || 'none';
    var term = params.get('utm_term') || params.get('keyword') || '';
    var gclid = params.get('gclid') || '';

    // Build ref tag
    var ref = '[ref: ' + source + '/' + campaign;
    if (term) ref += '/' + term;
    if (gclid) ref += '/gclid:' + gclid.substring(0, 12);
    ref += ']';

    // Update all WhatsApp links
    var links = document.querySelectorAll('a[href*="wa.me"]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      // Decode existing message
      var urlObj;
      try { urlObj = new URL(href); } catch(e) { return; }
      var existingText = urlObj.searchParams.get('text') || CONFIG.utm.defaultMessage;
      
      // Append ref if not already there
      if (existingText.indexOf('[ref:') === -1) {
        existingText += '\n' + ref;
      }

      urlObj.searchParams.set('text', existingText);
      link.setAttribute('href', urlObj.toString());
    });
  }


  // ═══════════════════════════════════════
  // TRACKING HELPER
  // ═══════════════════════════════════════
  window.mcTrack = function(event, params) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, Object.assign({
        page: window.location.pathname,
        source: 'mascolor-cro-engine'
      }, params || {}));
    }
  };

  // Global conversion tracker for CTA clicks
  window.tc = function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': CONFIG.tracking.adsId + '/WhatsApp_CTA_Click',
        'value': CONFIG.tracking.conversionValue,
        'currency': CONFIG.tracking.currency
      });
      gtag('event', 'wa_click', {
        'event_category': 'CRO',
        'event_label': window.location.pathname,
        'value': CONFIG.tracking.conversionValue
      });
    }
  };


  // ═══════════════════════════════════════
  // SCROLL DEPTH + ENGAGED VISIT
  // ═══════════════════════════════════════
  function initScrollTracking() {
    var tracked = {};
    window.addEventListener('scroll', function() {
      var pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(function(v) {
        if (pct >= v && !tracked[v]) {
          tracked[v] = true;
          mcTrack('scroll_depth', { percent: v });
        }
      });
    });

    // Engaged visit (30s)
    setTimeout(function() {
      mcTrack('engaged_visit', { seconds: 30 });
    }, 30000);
  }


  // ═══════════════════════════════════════
  // COOKIES HELPER
  // ═══════════════════════════════════════
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }


  // ═══════════════════════════════════════
  // INIT — Auto-run when DOM is ready
  // ═══════════════════════════════════════
  function init() {
    initDTR();
    initUTM();
    initToast();
    initScrollTracking();

    // Log init
    console.log('%c[MC-CRO] Engine loaded ✓', 'color:#ED951E;font-weight:bold');
    console.log('%c[MC-CRO] Features: DTR=' + CONFIG.dtr.enabled + ' TOAST=' + CONFIG.toast.enabled + ' UTM=' + CONFIG.utm.enabled, 'color:#6b7280');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose config for debugging
  window.MASCOLOR_CRO = { config: CONFIG, version: '1.0' };

})();
