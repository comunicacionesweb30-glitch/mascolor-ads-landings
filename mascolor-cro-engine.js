/**
 * ═══════════════════════════════════════════════════════════
 * MASCOLOR CRO ENGINE v1.0
 * ═══════════════════════════════════════════════════════════
 * 
 * 4 features PRO para landings de Google Ads:
 * 1. DTR  — Dynamic Text Replacement (H1 cambia por keyword)
 * 2. EXIT — Exit Intent Popup (gatito triste + oferta)
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

    // ── EXIT INTENT POPUP ──
    exit: {
      enabled: true,
      delay: 5000,           // Don't show before 5s on page
      cookieDays: 1,         // Don't show again for 1 day
      image: 'https://mascolortapetes.com/wp-content/uploads/2026/03/Gato-atrapamugre.png',
      headline: '¡Espera! No te vayas sin tu diseño gratis 🐱',
      text: 'Envíanos tu logo por WhatsApp y te mostramos cómo quedaría tu tapete. Sin compromiso — solo queremos que veas lo bien que puede quedar.',
      cta: 'Quiero mi diseño gratis',
      subtext: 'Respondemos en menos de 20 min · Diseño 100% gratis'
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
  // 2. EXIT INTENT POPUP
  // ═══════════════════════════════════════
  function initExitIntent() {
    if (!CONFIG.exit.enabled) return;
    if (getCookie('mc_exit_shown')) return;

    var ready = false;
    var shown = false;

    // Wait minimum time before enabling
    setTimeout(function() { ready = true; }, CONFIG.exit.delay);

    // Inject popup HTML + CSS
    var css = document.createElement('style');
    css.textContent = [
      '.mc-exit-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:mc-fadeIn .3s ease}',
      '.mc-exit-overlay.show{display:flex}',
      '.mc-exit-box{background:#fff;border-radius:24px;max-width:480px;width:100%;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.3);animation:mc-scaleIn .35s ease;position:relative}',
      '.mc-exit-close{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.06);border:none;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .2s;z-index:2}',
      '.mc-exit-close:hover{background:rgba(0,0,0,.12);color:#111}',
      '.mc-exit-img{width:100%;max-height:280px;object-fit:contain;background:#f7f8fa}',
      '.mc-exit-body{padding:28px 28px 24px;text-align:center}',
      '.mc-exit-body h3{font-family:"Outfit",sans-serif;font-size:22px;font-weight:800;color:#0f1d4a;line-height:1.2;margin-bottom:10px}',
      '.mc-exit-body p{font-family:"Outfit",sans-serif;font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:20px}',
      '.mc-exit-cta{display:inline-flex;align-items:center;gap:10px;font-family:"Outfit",sans-serif;font-size:16px;font-weight:700;background:#ED951E;color:#fff;padding:14px 32px;border-radius:60px;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(237,149,30,.35);transition:all .25s;text-decoration:none}',
      '.mc-exit-cta:hover{background:#d4830f;transform:translateY(-2px)}',
      '.mc-exit-cta svg{width:18px;height:18px;fill:#fff}',
      '.mc-exit-sub{font-family:"Outfit",sans-serif;font-size:12px;color:#6b7280;margin-top:12px}',
      '@keyframes mc-fadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes mc-scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}'
    ].join('');
    document.head.appendChild(css);

    var phone = CONFIG.defaultPhone;
    var params = new URLSearchParams(window.location.search);
    var utm = params.get('utm_source') || 'direct';
    var campaign = params.get('utm_campaign') || 'exit-popup';
    var msg = encodeURIComponent('Hola, casi me voy pero quiero ver el diseño gratis de mi tapete.\n[ref: ' + utm + '/' + campaign + '/exit-popup]');

    var overlay = document.createElement('div');
    overlay.className = 'mc-exit-overlay';
    overlay.innerHTML = '<div class="mc-exit-box">' +
      '<button class="mc-exit-close" onclick="this.parentElement.parentElement.classList.remove(\'show\')" aria-label="Cerrar">✕</button>' +
      '<img class="mc-exit-img" src="' + CONFIG.exit.image + '" alt="No te vayas — diseño gratis">' +
      '<div class="mc-exit-body">' +
        '<h3>' + CONFIG.exit.headline + '</h3>' +
        '<p>' + CONFIG.exit.text + '</p>' +
        '<a class="mc-exit-cta" href="https://wa.me/' + phone + '?text=' + msg + '" target="_blank" rel="noopener" onclick="mcTrack(\'exit_popup_click\')">' +
          '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.388A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' +
          CONFIG.exit.cta +
        '</a>' +
        '<div class="mc-exit-sub">' + CONFIG.exit.subtext + '</div>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('show');
    });

    function showPopup() {
      if (shown || !ready) return;
      shown = true;
      overlay.classList.add('show');
      setCookie('mc_exit_shown', '1', CONFIG.exit.cookieDays);
      mcTrack('exit_popup_shown');
    }

    // Desktop: mouse leaves viewport
    document.addEventListener('mouseout', function(e) {
      if (e.clientY <= 0 && e.relatedTarget === null) showPopup();
    });

    // Mobile: back button / history
    if ('ontouchstart' in window) {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', function() {
        showPopup();
        window.history.pushState(null, '', window.location.href);
      });
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
    initExitIntent();
    initToast();
    initScrollTracking();

    // Log init
    console.log('%c[MC-CRO] Engine loaded ✓', 'color:#ED951E;font-weight:bold');
    console.log('%c[MC-CRO] Features: DTR=' + CONFIG.dtr.enabled + ' EXIT=' + CONFIG.exit.enabled + ' TOAST=' + CONFIG.toast.enabled + ' UTM=' + CONFIG.utm.enabled, 'color:#6b7280');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose config for debugging
  window.MASCOLOR_CRO = { config: CONFIG, version: '1.0' };

})();
