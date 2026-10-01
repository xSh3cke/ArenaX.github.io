/* Arena X — preferencias, enlaces, navegación y comunidad. Sin dependencias. */
(() => {
  "use strict";
  const config = window.ARENA_CONFIG || {};
  const locales = window.ARENA_LOCALES || {};
  const languages = ["es", "en", "pt", "fr", "de", "it"];
  const themes = ["crimson", "midnight", "emerald", "violet", "silver"];
  const themeColors = { crimson: "#0b0b10", midnight: "#080e1b", emerald: "#09130f", violet: "#100d19", silver: "#101216" };
  const gameName = String(config.gameName || "Arena X");
  const creatorName = String(config.creator?.name || "Yxsus");
  const getStored = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferencias válidas durante esta visita. */ } };
  const selectedLanguage = getStored("arena-x-language") || config.defaultLanguage;
  let language = languages.includes(selectedLanguage) ? selectedLanguage : "es";
  const selectedTheme = getStored("arena-x-theme") || config.defaultTheme;
  let theme = themes.includes(selectedTheme) ? selectedTheme : "crimson";
  const languageSelect = document.querySelector("#language-select");
  const palette = document.querySelector("#theme-picker");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-nav");
  const discordCard = document.querySelector(".discord-live-card");
  let stats = null, statsTime = null, statsPhase = "loading";

  function t(key, variables = {}) {
    const text = locales[language]?.[key] || locales.es?.[key] || key;
    const values = { game: gameName, creator: creatorName, ...variables };
    return text.replace(/\{([a-z]+)\}/g, (token, name) => values[name] === undefined ? token : String(values[name]));
  }
  function menuLabel() {
    menuButton.setAttribute("aria-label", t(menuButton.getAttribute("aria-expanded") === "true" ? "menu.close" : "menu.open"));
  }
  function renderStats() {
    const format = new Intl.NumberFormat(language);
    document.querySelectorAll("[data-discord-count]").forEach(element => {
      const value = stats?.[element.dataset.discordCount];
      element.textContent = Number.isSafeInteger(value) ? format.format(value) : "—";
    });
    if (stats?.name) document.querySelector("#discord-server-name").textContent = stats.name;
    document.querySelector("#discord-data-note").textContent = t(stats?.source === "widget" ? "discord.partial" : "discord.note");
    const time = statsTime ? new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(statsTime) : "";
    const key = statsPhase === "ready" ? "discord.updated" : statsPhase === "stale" ? "discord.stale" : statsPhase === "error" ? "discord.error" : "discord.loading";
    document.querySelector("[data-discord-status]").textContent = t(key, { time });
    discordCard.dataset.state = statsPhase;
    discordCard.setAttribute("aria-busy", String(statsPhase === "loading"));
  }
  function applyLanguage(value, persist = true) {
    language = languages.includes(value) ? value : "es";
    document.documentElement.lang = language;
    languageSelect.value = language;
    document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
    // Los textos personalizables de config.js se aplican al español; los otros idiomas están en locales.js.
    document.querySelectorAll("[data-copy]").forEach(element => {
      if (language !== "es" && element.dataset.copy !== "creator.name") return;
      const value = element.dataset.copy.split(".").reduce((item, key) => item?.[key], config);
      if (typeof value === "string") element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(element => element.setAttribute("aria-label", t(element.dataset.i18nAria)));
    document.querySelectorAll("[data-brand]").forEach(element => element.setAttribute("aria-label", t("brand.home")));
    document.querySelector("[data-hero-image]").alt = language === "es" && config.hero?.imageAlt ? config.hero.imageAlt : t("hero.alt");
    document.title = `${gameName} · ${t("footer.tagline")}`;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[name="description"]').content = t("meta.description");
    document.querySelector('meta[property="og:description"]').content = t("meta.description");
    menuLabel();
    renderStats();
    if (persist) save("arena-x-language", language);
  }
  function applyTheme(value, persist = true) {
    theme = themes.includes(value) ? value : "crimson";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = themeColors[theme];
    palette.querySelectorAll("[data-theme-choice]").forEach(button => {
      const active = button.dataset.themeChoice === theme;
      button.setAttribute("aria-checked", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (persist) save("arena-x-theme", theme);
  }
  languageSelect.addEventListener("change", event => applyLanguage(event.target.value));
  palette.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeChoice);
      palette.open = false;
      palette.querySelector("summary").focus({ preventScroll: true });
    });
    button.addEventListener("keydown", event => {
      const directions = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      const current = themes.indexOf(button.dataset.themeChoice);
      const index = event.key === "Home" ? 0 : event.key === "End" ? themes.length - 1 : event.key in directions ? (current + directions[event.key] + themes.length) % themes.length : null;
      if (index === null) return;
      event.preventDefault();
      applyTheme(themes[index]);
      palette.querySelector(`[data-theme-choice="${themes[index]}"]`).focus();
    });
  });
  document.querySelectorAll("[data-wordmark]").forEach(element => { element.textContent = gameName.replace(/\s+x$/i, "").toUpperCase(); });
  document.querySelectorAll("[data-game-name]").forEach(element => { element.textContent = gameName; });
  document.querySelectorAll("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
  if (config.creator?.initials) document.querySelector("[data-creator-initials]").textContent = config.creator.initials;
  if (config.hero?.image) document.querySelector("[data-hero-image]").src = config.hero.image;
  if (config.hero?.mobileImage) document.querySelector("[data-hero-mobile]").srcset = config.hero.mobileImage;

  function externalUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  const playDialog = document.querySelector("#play-dialog");
  const warningDialog = document.querySelector("#connection-dialog");
  const browserLink = document.querySelector("[data-play-browser]");
  const appLink = document.querySelector("[data-roblox-app]");
  const playUrl = externalUrl(config.links?.play);
  browserLink.hidden = !playUrl;
  if (playUrl) browserLink.href = playUrl;
  const validPlaceId = typeof config.roblox?.placeId === "string" && /^\d{1,20}$/.test(config.roblox.placeId);
  appLink.hidden = !validPlaceId;
  if (validPlaceId) appLink.href = `roblox://placeId=${config.roblox.placeId}`;
  document.querySelectorAll("[data-link]").forEach(link => {
    const key = link.dataset.link;
    const url = externalUrl(config.links?.[key]);
    link.dataset.connected = String(Boolean(url));
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    if (!url || key === "play") {
      link.setAttribute("aria-haspopup", "dialog");
      link.setAttribute("aria-controls", url ? "play-dialog" : "connection-dialog");
      link.addEventListener("click", event => {
        // Ctrl/cmd/clic central conserva el enlace normal de Roblox.
        if (url && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)) return;
        event.preventDefault();
        const dialog = url ? playDialog : warningDialog;
        if (!dialog.open) dialog.showModal();
      });
    }
  });
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));

  document.body.classList.add("has-js");
  menuButton.hidden = false;
  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuLabel();
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuLabel();
    palette.open = false;
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  palette.addEventListener("toggle", () => { if (palette.open) closeMenu(); });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
    if (palette.open) { palette.open = false; palette.querySelector("summary").focus(); }
    if (menuButton.getAttribute("aria-expanded") === "true") { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener("click", event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    if (!palette.contains(event.target)) palette.open = false;
  });
  window.matchMedia("(max-width: 1000px)").addEventListener("change", closeMenu);
  if ("IntersectionObserver" in window) {
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const id = visible[visible.length - 1].target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("#inicio, #juego, #creador, #comunidad").forEach(section => observer.observe(section));
  }
  applyTheme(theme, false);
  applyLanguage(language, false);

  // Actualiza como máximo cada dos minutos y pausa las consultas en pestañas ocultas.
  const requestedRefresh = Number(config.discord?.refreshSeconds) * 1000;
  const refreshMs = Math.min(3600000, Math.max(120000, Number.isFinite(requestedRefresh) ? requestedRefresh : 120000));
  let timer, inFlight = false, nextFetch = 0;
  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(updateStats, Math.max(100, nextFetch - Date.now()));
  }
  async function updateStats() {
    if (document.hidden || inFlight) return;
    inFlight = true;
    let delay = refreshMs;
    try {
      stats = await window.ArenaDiscord.fetchStats(config.discord || {});
      statsTime = new Date();
      statsPhase = "ready";
    } catch (error) {
      statsPhase = stats ? "stale" : "error";
      delay = Math.max(refreshMs, error.retryAfterMs || 0);
    } finally {
      inFlight = false;
      renderStats();
      nextFetch = Date.now() + delay;
      schedule();
    }
  }
  document.addEventListener("visibilitychange", schedule);
  if (!document.hidden) updateStats();
})();
