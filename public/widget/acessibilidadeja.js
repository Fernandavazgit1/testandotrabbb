/*!
 * AcessibilidadeJá - Widget de Acessibilidade
 * Standalone vanilla JS. Inclua em qualquer site:
 *   <script src="https://seudominio.com/widget/acessibilidadeja.js" defer></script>
 * Opcional, configure antes de carregar:
 *   <script>window.AcessibilidadeJaConfig = { position: 'bottom-right', lang: 'pt-BR' }</script>
 */
(function () {
  'use strict';
  var WidgetSingleton = {
    isReady: function () { return !!window.__AcessibilidadeJa__; },
    markReady: function () { window.__AcessibilidadeJa__ = true; },
  };

  if (WidgetSingleton.isReady()) return;
  WidgetSingleton.markReady();

  var CFG = Object.assign({ position: 'bottom-right', lang: 'pt-BR' }, window.AcessibilidadeJaConfig || {});
  var STORAGE_KEY = 'acessibilidadeja:state:v1';
  var state = loadState();

  // ---------- styles ----------
  var css = `
  .ajw-root, .ajw-root * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .ajw-fab {
    position: fixed; ${CFG.position.indexOf('bottom') > -1 ? 'bottom:20px;' : 'top:20px;'}
    ${CFG.position.indexOf('right') > -1 ? 'right:20px;' : 'left:20px;'}
    width:60px; height:60px; border-radius:50%; border:none; cursor:pointer;
    background:#1B5E6E; color:#fff; box-shadow:0 8px 24px rgba(27,94,110,.35);
    display:flex; align-items:center; justify-content:center; z-index:2147483646;
    transition:transform .2s ease;
  }
  .ajw-fab:hover { transform: scale(1.08); }
  .ajw-fab svg { width:32px; height:32px; }
  .ajw-overlay { position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:2147483646; opacity:0; pointer-events:none; transition:opacity .25s ease; }
  .ajw-overlay.open { opacity:1; pointer-events:auto; }
  .ajw-panel {
    position:fixed; top:0; ${CFG.position.indexOf('right') > -1 ? 'right:0;' : 'left:0;'}
    height:100vh; width:340px; max-width:90vw; background:#fff; color:#1a2a30;
    box-shadow:-10px 0 40px rgba(0,0,0,.18); z-index:2147483647;
    transform: translateX(${CFG.position.indexOf('right') > -1 ? '100%' : '-100%'});
    transition: transform .3s cubic-bezier(.2,.8,.2,1);
    display:flex; flex-direction:column;
  }
  .ajw-panel.open { transform: translateX(0); }
  .ajw-header { padding:18px 20px; border-bottom:1px solid #e6eef0; display:flex; align-items:center; justify-content:space-between; }
  .ajw-title { font-size:18px; font-weight:700; color:#1B5E6E; margin:0; display:flex; gap:10px; align-items:center; }
  .ajw-close { background:none; border:none; cursor:pointer; padding:6px; color:#1B5E6E; border-radius:8px; }
  .ajw-close:hover { background:#eef5f7; }
  .ajw-body { padding:14px; overflow-y:auto; flex:1; }
  .ajw-item { display:flex; align-items:center; gap:12px; width:100%; padding:12px 14px; margin-bottom:8px;
              border:1px solidrgb(66, 191, 223); background:#fff; border-radius:14px; cursor:pointer; text-align:left;
              color:#1a2a30; font-size:14px; font-weight:500; transition:all .15s; }
  .ajw-item:hover { border-color:#1B5E6E; background:#f3fafc; }
  .ajw-item.active { background:#1B5E6E; color:#fff; border-color:#1B5E6E; }
  .ajw-item svg { width:22px; height:22px; flex-shrink:0; }
  .ajw-section-title { font-size:11px; font-weight:700; color:#5a7680; text-transform:uppercase; letter-spacing:.08em; margin:14px 6px 8px; }
  .ajw-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1px solid #e6eef0; border-radius:14px; margin-bottom:8px; }
  .ajw-row label { font-size:14px; font-weight:500; }
  .ajw-stepper { display:flex; align-items:center; gap:6px; }
  .ajw-stepper button { width:28px; height:28px; border-radius:50%; border:1px solid #1B5E6E; background:#fff; color:#1B5E6E; cursor:pointer; font-size:16px; font-weight:700; }
  .ajw-stepper span { min-width:36px; text-align:center; font-weight:600; font-size:13px; }
  .ajw-select { width:100%; padding:8px 10px; border-radius:10px; border:1px solid #cbd9dd; background:#fff; font-size:14px; }
  .ajw-footer { padding:14px; border-top:1px solid #e6eef0; }
  .ajw-reset { width:100%; padding:12px; border-radius:14px; border:1px solid #1B5E6E; background:#fff; color:#1B5E6E; cursor:pointer; font-weight:600; font-size:14px; }
  .ajw-reset:hover { background:#1B5E6E; color:#fff; }
  .ajw-credit { text-align:center; font-size:11px; color:#7a8e94; margin-top:10px; }

  /* Aplicado no host */
  html.ajw-contrast-light { filter: contrast(1.2) brightness(1.1) !important; background:#fff !important; }
  html.ajw-contrast-dark, html.ajw-contrast-dark body { background:#000 !important; color:#fff !important; }
  html.ajw-contrast-dark a { color:#7CD0E5 !important; }
  html.ajw-contrast-dark img, html.ajw-contrast-dark video { filter: brightness(.85) !important; }
  html.ajw-grayscale { filter: grayscale(100%) !important; }
  html.ajw-highlight-links a { background:#FFEB3B !important; color:#000 !important; text-decoration:underline !important; padding:0 2px; border-radius:3px; }
  html.ajw-pause-anim *, html.ajw-pause-anim *::before, html.ajw-pause-anim *::after {
    animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important;
  }
  html.ajw-dyslexia, html.ajw-dyslexia body, html.ajw-dyslexia * {
    font-family: "OpenDyslexic", "Comic Sans MS", "Trebuchet MS", sans-serif !important;
    letter-spacing: 0.08em !important; word-spacing: 0.16em !important; line-height: 1.7 !important;
  }
  html.ajw-reading-mode main, html.ajw-reading-mode article, html.ajw-reading-mode body {
    background: #fdf6e3 !important; color: #073642 !important;
  }
  html.ajw-reading-mode aside:not(.ajw-panel),
  html.ajw-reading-mode nav:not(.ajw-root nav),
  html.ajw-reading-mode video,
  html.ajw-reading-mode iframe { display:none !important; }
  .ajw-reading-exit {
    position:fixed; top:14px; left:50%; transform:translateX(-50%);
    z-index:2147483647; display:none; align-items:center; gap:12px;
    padding:10px 18px; background:#1B5E6E; color:#fff; border-radius:999px;
    box-shadow:0 6px 24px rgba(27,94,110,.45); font-size:14px; font-weight:600;
    max-width:calc(100vw - 24px); flex-wrap:wrap; justify-content:center;
  }
  .ajw-reading-exit.visible { display:flex; }
  .ajw-reading-exit-btn {
    background:#fff; color:#1B5E6E; border:none; padding:7px 16px; border-radius:999px;
    cursor:pointer; font-weight:700; font-size:13px; white-space:nowrap;
  }
  .ajw-reading-exit-btn:hover { opacity:.92; }
  .ajw-reading-exit-btn:focus-visible { outline:2px solid #fff; outline-offset:2px; }
  html.ajw-big-cursor, html.ajw-big-cursor * { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="%23000" stroke="%23fff" stroke-width="2" d="M8 4l28 16-13 3 7 14-5 3-7-14-10 8z"/></svg>') 4 4, auto !important; }
  .ajw-reading-guide { position:fixed; left:0; right:0; height:60px; background:rgba(0,0,0,.55); pointer-events:none; z-index:2147483645; transition:top .05s linear; }
  .ajw-reading-guide::before, .ajw-reading-guide::after { content:''; position:absolute; left:0; right:0; height:9999px; background:rgba(0,0,0,.55); pointer-events:none; }
  .ajw-reading-guide::before { bottom:100%; }
  .ajw-reading-guide::after { top:100%; }
  `;

  // ---------- creation patterns ----------
  var IconFactory = {
    icons: {
      contrast_light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
      contrast_dark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
      zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/></svg>',
      reading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>',
      guide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 7h18M3 17h18"/></svg>',
      dyslexia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l16 16M20 4L4 20"/></svg>',
      translate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h10M9 4v4M5 12s2 5 7 5 7-5 7-5M14 14l4 8 4-8M16 19h4"/></svg>',
      cursor: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 8-6 1 4 8-3 1-4-8-5 4z"/></svg>',
      links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>',
      pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
      grayscale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
      access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M5 9l4.5 1.5h5L19 9M12 10.5V14M12 14l-3 7M12 14l3 7"/></svg>',
      close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    },
    create: function (name) {
      return this.icons[name] || '';
    },
  };

  var OptionPrototype = {
    type: 'toggle',
    clone: function (props) {
      return Object.assign({}, this, props || {});
    },
  };

  var toggleOptions = [
    OptionPrototype.clone({ section: 'VisualizaÃ§Ã£o', key: 'contrast-light', icon: 'contrast_light', label: 'Contraste claro' }),
    OptionPrototype.clone({ section: 'VisualizaÃ§Ã£o', key: 'contrast-dark', icon: 'contrast_dark', label: 'Contraste escuro' }),
    OptionPrototype.clone({ section: 'VisualizaÃ§Ã£o', key: 'grayscale', icon: 'grayscale', label: 'Escala de cinza' }),
    OptionPrototype.clone({ section: 'VisualizaÃ§Ã£o', key: 'highlight-links', icon: 'links', label: 'Destacar links' }),
    OptionPrototype.clone({ section: 'Leitura', key: 'reading-mode', icon: 'reading', label: 'Modo leitura' }),
    OptionPrototype.clone({ section: 'Leitura', key: 'reading-guide', icon: 'guide', label: 'Guia de leitura' }),
    OptionPrototype.clone({ section: 'Leitura', key: 'dyslexia', icon: 'dyslexia', label: 'Fonte para dislexia' }),
    OptionPrototype.clone({ section: 'NavegaÃ§Ã£o', key: 'big-cursor', icon: 'cursor', label: 'Cursor grande' }),
    OptionPrototype.clone({ section: 'NavegaÃ§Ã£o', key: 'pause-anim', icon: 'pause', label: 'Pausar animaÃ§Ãµes' }),
  ];

  var WidgetElementFactory = {
    createStyle: function (content) {
      var styleEl = document.createElement('style');
      styleEl.id = 'ajw-styles';
      styleEl.textContent = content;
      return styleEl;
    },
    createRoot: function () {
      var root = document.createElement('div');
      root.className = 'ajw-root';
      root.setAttribute('aria-label', 'Widget de Acessibilidade');
      return root;
    },
    createExternalScript: function (id, src) {
      var script = document.createElement('script');
      script.id = id;
      script.src = src;
      return script;
    },
    createGuide: function () {
      var guide = document.createElement('div');
      guide.className = 'ajw-reading-guide';
      return guide;
    },
    createHiddenTranslateTarget: function () {
      var div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      return div;
    },
  };

  function WidgetBuilder(factory, iconFactory) {
    this.factory = factory;
    this.iconFactory = iconFactory;
    this.root = null;
  }

  WidgetBuilder.prototype.mountStyles = function (content) {
    document.head.appendChild(this.factory.createStyle(content));
    return this;
  };

  WidgetBuilder.prototype.mountRoot = function () {
    this.root = this.factory.createRoot();
    document.body.appendChild(this.root);
    return this;
  };

  WidgetBuilder.prototype.buildToggleSections = function () {
    var html = '';
    var currentSection = '';
    toggleOptions.forEach(function (option) {
      if (option.section !== currentSection) {
        currentSection = option.section;
        html += '<div class="ajw-section-title">' + currentSection + '</div>';
        if (currentSection === 'Leitura') html += WidgetTemplates.zoomControl();
      }
      html += WidgetTemplates.toggleButton(option, this.iconFactory);
    }, this);
    return html;
  };

  WidgetBuilder.prototype.render = function () {
    this.root.innerHTML = WidgetTemplates.shell(this.iconFactory, this.buildToggleSections());
    return this.root;
  };

  var WidgetTemplates = {
    toggleButton: function (option, iconFactory) {
      return '<button class="ajw-item" data-toggle="' + option.key + '">' +
        iconFactory.create(option.icon) + '<span>' + option.label + '</span></button>';
    },
    zoomControl: function () {
      return [
        '<div class="ajw-row">',
        '  <label>Tamanho do texto</label>',
        '  <div class="ajw-stepper">',
        '    <button id="ajwZoomMinus" aria-label="Diminuir texto">âˆ’</button>',
        '    <span id="ajwZoomVal">100%</span>',
        '    <button id="ajwZoomPlus" aria-label="Aumentar texto">+</button>',
        '  </div>',
        '</div>',
      ].join('');
    },
    translator: function (iconFactory) {
      return [
        '<div class="ajw-section-title">Tradutor</div>',
        '<div class="ajw-row" style="flex-direction:column;align-items:stretch;gap:8px">',
        '  <label style="display:flex;gap:8px;align-items:center">' + iconFactory.create('translate') + ' Traduzir pÃ¡gina</label>',
        '  <select class="ajw-select" id="ajwLang">',
        '    <option value="">Idioma original</option>',
        '    <option value="en">English</option>',
        '    <option value="es">EspaÃ±ol</option>',
        '    <option value="fr">FranÃ§ais</option>',
        '    <option value="de">Deutsch</option>',
        '    <option value="it">Italiano</option>',
        '    <option value="ja">æ—¥æœ¬èªž</option>',
        '    <option value="zh-CN">ä¸­æ–‡</option>',
        '  </select>',
        '</div>',
      ].join('');
    },
    shell: function (iconFactory, toggleSections) {
      return [
        '<div class="ajw-reading-exit" id="ajwReadingExit" role="status" aria-live="polite">',
        '  <span>Modo leitura ativo</span>',
        '  <button type="button" class="ajw-reading-exit-btn" id="ajwReadingExitBtn">Sair do modo leitura</button>',
        '</div>',
        '<button class="ajw-fab" id="ajwFab" aria-label="Abrir menu de acessibilidade" title="Acessibilidade">' + iconFactory.create('access') + '</button>',
        '<div class="ajw-overlay" id="ajwOverlay"></div>',
        '<aside class="ajw-panel" id="ajwPanel" role="dialog" aria-modal="true" aria-label="Recursos de acessibilidade">',
        '  <div class="ajw-header">',
        '    <h2 class="ajw-title">' + iconFactory.create('access') + ' AcessibilidadeJÃ¡</h2>',
        '    <button class="ajw-close" id="ajwClose" aria-label="Fechar">' + iconFactory.create('close') + '</button>',
        '  </div>',
        '  <div class="ajw-body">',
             toggleSections,
             WidgetTemplates.translator(iconFactory),
        '  </div>',
        '  <div class="ajw-footer">',
        '    <button class="ajw-reset" id="ajwReset">Redefinir tudo</button>',
        '    <div class="ajw-credit">Powered by AcessibilidadeJÃ¡</div>',
        '  </div>',
        '</aside>',
      ].join('');
    },
  }

  function icon(name) {
    return IconFactory.create(name);
  }

  // ---------- DOM ----------
  var styleEl = WidgetElementFactory.createStyle(css);
  document.head.appendChild(styleEl);

  var widgetBuilder = new WidgetBuilder(WidgetElementFactory, IconFactory).mountRoot();
  var root = widgetBuilder.root;

  root.innerHTML = `
    <div class="ajw-reading-exit" id="ajwReadingExit" role="status" aria-live="polite">
      <span>Modo leitura ativo</span>
      <button type="button" class="ajw-reading-exit-btn" id="ajwReadingExitBtn">Sair do modo leitura</button>
    </div>
    <button class="ajw-fab" id="ajwFab" aria-label="Abrir menu de acessibilidade" title="Acessibilidade">${icon('access')}</button>
    <div class="ajw-overlay" id="ajwOverlay"></div>
    <aside class="ajw-panel" id="ajwPanel" role="dialog" aria-modal="true" aria-label="Recursos de acessibilidade">
      <div class="ajw-header">
        <h2 class="ajw-title">${icon('access')} AcessibilidadeJá</h2>
        <button class="ajw-close" id="ajwClose" aria-label="Fechar">${icon('close')}</button>
      </div>
      <div class="ajw-body">
        <div class="ajw-section-title">Visualização</div>
        <button class="ajw-item" data-toggle="contrast-light">${icon('contrast_light')}<span>Contraste claro</span></button>
        <button class="ajw-item" data-toggle="contrast-dark">${icon('contrast_dark')}<span>Contraste escuro</span></button>
        <button class="ajw-item" data-toggle="grayscale">${icon('grayscale')}<span>Escala de cinza</span></button>
        <button class="ajw-item" data-toggle="highlight-links">${icon('links')}<span>Destacar links</span></button>

        <div class="ajw-section-title">Leitura</div>
        <div class="ajw-row">
          <label>Tamanho do texto</label>
          <div class="ajw-stepper">
            <button id="ajwZoomMinus" aria-label="Diminuir texto">−</button>
            <span id="ajwZoomVal">100%</span>
            <button id="ajwZoomPlus" aria-label="Aumentar texto">+</button>
          </div>
        </div>
        <button class="ajw-item" data-toggle="reading-mode">${icon('reading')}<span>Modo leitura</span></button>
        <button class="ajw-item" data-toggle="reading-guide">${icon('guide')}<span>Guia de leitura</span></button>
        <button class="ajw-item" data-toggle="dyslexia">${icon('dyslexia')}<span>Fonte para dislexia</span></button>

        <div class="ajw-section-title">Navegação</div>
        <button class="ajw-item" data-toggle="big-cursor">${icon('cursor')}<span>Cursor grande</span></button>
        <button class="ajw-item" data-toggle="pause-anim">${icon('pause')}<span>Pausar animações</span></button>

        <div class="ajw-section-title">Tradutor</div>
        <div class="ajw-row" style="flex-direction:column;align-items:stretch;gap:8px">
          <label style="display:flex;gap:8px;align-items:center">${icon('translate')} Traduzir página</label>
          <select class="ajw-select" id="ajwLang">
            <option value="">Idioma original</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="ja">日本語</option>
            <option value="zh-CN">中文</option>
          </select>
        </div>
      </div>
      <div class="ajw-footer">
        <button class="ajw-reset" id="ajwReset">Redefinir tudo</button>
        <div class="ajw-credit">Powered by AcessibilidadeJá</div>
      </div>
    </aside>
  `;

  var fab = root.querySelector('#ajwFab');
  var panel = root.querySelector('#ajwPanel');
  var overlay = root.querySelector('#ajwOverlay');
  var closeBtn = root.querySelector('#ajwClose');
  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function open() { panel.classList.add('open'); overlay.classList.add('open'); }
  function close() { panel.classList.remove('open'); overlay.classList.remove('open'); }

  // toggles
  root.querySelectorAll('[data-toggle]').forEach(function (btn) {
    var key = btn.getAttribute('data-toggle');
    if (state.toggles[key]) btn.classList.add('active');
    btn.addEventListener('click', function () {
      state.toggles[key] = !state.toggles[key];
      btn.classList.toggle('active', state.toggles[key]);
      // mutually exclusive contrasts
      if (state.toggles[key] && (key === 'contrast-light' || key === 'contrast-dark')) {
        var other = key === 'contrast-light' ? 'contrast-dark' : 'contrast-light';
        state.toggles[other] = false;
        var otherBtn = root.querySelector('[data-toggle="' + other + '"]');
        if (otherBtn) otherBtn.classList.remove('active');
      }
      apply();
    });
  });

  // zoom
  var zoomVal = root.querySelector('#ajwZoomVal');
  root.querySelector('#ajwZoomMinus').addEventListener('click', function () { setZoom(state.zoom - 10); });
  root.querySelector('#ajwZoomPlus').addEventListener('click', function () { setZoom(state.zoom + 10); });
  function setZoom(v) { state.zoom = Math.max(80, Math.min(180, v)); apply(); }

  // language
  var langSel = root.querySelector('#ajwLang');
  langSel.value = state.lang || '';
  langSel.addEventListener('change', function () { state.lang = langSel.value; apply(); });

  function setReadingMode(on) {
    state.toggles['reading-mode'] = !!on;
    var btn = root.querySelector('[data-toggle="reading-mode"]');
    if (btn) btn.classList.toggle('active', !!on);
    apply();
  }

  root.querySelector('#ajwReadingExitBtn').addEventListener('click', function () {
    setReadingMode(false);
  });

  // reset
  root.querySelector('#ajwReset').addEventListener('click', function () {
    state = defaultState();
    save();
    location.reload();
  });

  // reading guide
  var guideEl = null;
  function ensureGuide(on) {
    if (on && !guideEl) {
      guideEl = WidgetElementFactory.createGuide();
      document.body.appendChild(guideEl);
      document.addEventListener('mousemove', moveGuide);
      moveGuide({ clientY: window.innerHeight / 2 });
    } else if (!on && guideEl) {
      document.removeEventListener('mousemove', moveGuide);
      guideEl.remove(); guideEl = null;
    }
  }
  function moveGuide(e) { if (guideEl) guideEl.style.top = (e.clientY - 30) + 'px'; }

  // translator (Google Translate)
  function applyTranslator(lang) {
    if (!lang) {
      // remove
      var s = document.getElementById('google_translate_element');
      if (s) s.remove();
      // clear cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      var host = location.hostname.replace(/^www\./, '');
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + host;
      return;
    }
    document.cookie = 'googtrans=/auto/' + lang + '; path=/';
    var host = location.hostname.replace(/^www\./, '');
    document.cookie = 'googtrans=/auto/' + lang + '; path=/; domain=.' + host;
    if (!document.getElementById('google_translate_script')) {
      var div = WidgetElementFactory.createHiddenTranslateTarget();
      document.body.appendChild(div);
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement({ pageLanguage: 'auto', autoDisplay: false }, 'google_translate_element');
      };
      var s = WidgetElementFactory.createExternalScript('google_translate_script', 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.head.appendChild(s);
    } else {
      // re-trigger via reload (Google's cookie strategy)
      location.reload();
    }
  }

  // apply state to host
  function apply() {
    var html = document.documentElement;
    var classes = toggleOptions
      .map(function (option) { return option.key; })
      .filter(function (key) { return key !== 'reading-guide'; });
    classes.forEach(function (c) {
      html.classList.toggle('ajw-' + c, !!state.toggles[c]);
    });
    document.documentElement.style.fontSize = state.zoom === 100 ? '' : state.zoom + '%';
    zoomVal.textContent = state.zoom + '%';
    ensureGuide(!!state.toggles['reading-guide']);
    var readingOn = !!state.toggles['reading-mode'];
    var exitBar = root.querySelector('#ajwReadingExit');
    var readingLabel = root.querySelector('[data-toggle="reading-mode"] span');
    if (exitBar) exitBar.classList.toggle('visible', readingOn);
    if (readingLabel) readingLabel.textContent = readingOn ? 'Sair do modo leitura' : 'Modo leitura';
    if (state.lang !== state._appliedLang) {
      state._appliedLang = state.lang;
      applyTranslator(state.lang);
    }
    save();
  }

  function defaultState() {
    return { toggles: {}, zoom: 100, lang: '' };
  }
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {}
    return defaultState();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // initial apply (sem disparar tradutor de novo)
  state._appliedLang = state.lang;
  apply();

  // Public API
  window.AcessibilidadeJa = {
    open: open, close: close,
    reset: function () { state = defaultState(); save(); location.reload(); }
  };
})();
