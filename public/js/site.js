(function () {
  "use strict";

  var LOGO_SVG =
    '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="40"/>' +
    '<circle cx="50" cy="28" r="8" fill="currentColor" fill-opacity="0.5"/>' +
    '<circle cx="22" cy="55" r="4" fill="currentColor"/>' +
    '<circle cx="78" cy="55" r="4" fill="currentColor"/>' +
    '<circle cx="38" cy="78" r="4" fill="currentColor"/>' +
    '<circle cx="62" cy="78" r="4" fill="currentColor"/>' +
    '<path d="M50 36 L22 55 M50 36 L78 55 M50 36 L38 78 M50 36 L62 78"/>' +
    "</svg>";

  var ICONS = {
    arrowLeft:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    arrowRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    play:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    sun:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
    zoom:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/></svg>',
    book:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>',
    align:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 12h18M3 7h18M3 17h12"/></svg>',
    eye:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    refresh:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12a9 9 0 11-3-6.7M21 3v6h-6"/></svg>',
    languages:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 8h10M9 4v4M5 12s2 5 7 5 7-5 7-5M14 14l4 8 4-8M16 19h4"/></svg>',
    cursor:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 8-6 1 4 8-3 1-4-8-5 4z"/></svg>',
  };

  function currentPage() {
    var path = window.location.pathname.replace(/\/$/, "") || "/";
    if (path.endsWith("index.html") || path === "/" || path === "") return "home";
    if (path.includes("recursos")) return "recursos";
    if (path.includes("integrar")) return "integrar";
    return "";
  }

  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;

    var page = currentPage();
    var recursosActive = page === "recursos" ? " is-active" : "";
    var integrarActive = page === "integrar" ? " is-active" : "";

    el.innerHTML =
      '<header class="site-header">' +
      '<div class="site-header__inner">' +
      '<a href="index.html" class="brand">' +
      LOGO_SVG +
      "<span>AcessibilidadeJá</span></a>" +
      '<nav class="site-nav" aria-label="Principal">' +
      '<a href="recursos.html"' +
      recursosActive +
      ">Recursos</a>" +
      '<a href="integrar.html"' +
      integrarActive +
      ">Integrar</a>" +
      "</nav>" +
      "</div></header>";

  }

  function loadWidget() {
    if (document.getElementById("ajw-demo-script")) return;
    var s = document.createElement("script");
    s.id = "ajw-demo-script";
    s.src = "/widget/acessibilidadeja.js";
    s.defer = true;
    document.body.appendChild(s);
  }

  function openAccessibilityWidget(attempt) {
    attempt = attempt || 0;
    var api = window.AcessibilidadeJa;

    if (api && typeof api.abrir === "function") {
      api.abrir();
      return;
    }

    if (api && typeof api.open === "function") {
      api.open();
      return;
    }

    loadWidget();

    if (attempt < 20) {
      setTimeout(function () {
        openAccessibilityWidget(attempt + 1);
      }, 100);
    }
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach(function (wrap) {
      var pre = wrap.querySelector("pre code");
      var btn = wrap.querySelector(".code-block__copy");
      if (!pre || !btn) return;

      btn.addEventListener("click", function () {
        var text = pre.textContent || "";
        navigator.clipboard.writeText(text).then(function () {
          btn.innerHTML = ICONS.check;
          btn.setAttribute("aria-label", "Copiado");
          setTimeout(function () {
            btn.innerHTML = ICONS.copy;
            btn.setAttribute("aria-label", "Copiar código");
          }, 1500);
        });
      });
    });
  }

  function initRecursos() {
    document.querySelectorAll("[data-open-widget]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openAccessibilityWidget();
      });
    });
  }

  function fillIntegrarSnippets() {
    var origin = window.location.origin;
    var snippet = '<script src="' + origin + '/widget/acessibilidadeja.js" defer><\/script>';

    var elSnippet = document.getElementById("snippet-html");
    var elConfig = document.getElementById("snippet-config");

    if (elSnippet) elSnippet.textContent = snippet;
    if (elConfig) {
      elConfig.textContent =
        "<script>\n" +
        "  window.AcessibilidadeJaConfig = {\n" +
        '    position: "bottom-right",\n' +
        '    lang: "pt-BR"\n' +
        "  };\n" +
        "<\/script>\n" +
        snippet;
    }
  }

  window.SiteIcons = ICONS;
  window.SiteLogo = LOGO_SVG;

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    loadWidget();
    initCopyButtons();
    initRecursos();
    fillIntegrarSnippets();

    var heroLogo = document.getElementById("hero-logo");
    if (heroLogo) heroLogo.innerHTML = LOGO_SVG;
  });
})();
