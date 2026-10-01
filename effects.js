/* VFX ligeros: partículas, brillo, entradas y profundidad. Sin sonido ni librerías. */
(() => {
  "use strict";
  const config = window.ARENA_CONFIG?.effects || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine) and (min-width: 801px)");
  const hero = document.querySelector(".hero");
  const field = document.querySelector(".particle-field");
  const cards = [...document.querySelectorAll(".feature-card,.social-card")];
  const enabled = () => config.enabled !== false && !reducedMotion.matches;
  let revealObserver;
  function syncMotion() {
    const active = enabled();
    document.body.classList.toggle("motion-ready", active);
    field.replaceChildren();
    revealObserver?.disconnect();
    if (!active) {
      hero.style.removeProperty("--hero-x"); hero.style.removeProperty("--hero-y");
      return;
    }
    const requestedCount = Number(config.particles);
    const count = Math.min(24, Math.max(0, Math.floor(Number.isFinite(requestedCount) ? requestedCount : 16)));
    for (let index = 0; index < count; index++) {
      const particle = document.createElement("span");
      particle.className = "arena-particle";
      particle.style.setProperty("--particle-x", `${25 + Math.random() * 72}%`);
      particle.style.setProperty("--particle-size", `${1 + Math.random() * 2}px`);
      particle.style.setProperty("--particle-duration", `${10 + Math.random() * 12}s`);
      particle.style.setProperty("--particle-delay", `${-Math.random() * 22}s`);
      particle.style.setProperty("--particle-drift", `${Math.random() * 70 - 35}px`);
      field.append(particle);
    }
    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-once");
        revealObserver.unobserve(entry.target);
      }), { threshold: .08 });
      document.querySelectorAll(".section-heading,.feature-card,.creator-intro,.creator-card,.discord-banner,.social-card,.faq-layout").forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${index % 3 * 65}ms`);
        revealObserver.observe(element);
      });
    }
  }
  syncMotion();
  reducedMotion.addEventListener("change", syncMotion);
  let heroFrame;
  hero.addEventListener("pointermove", event => {
    if (!enabled() || !finePointer.matches) return;
    cancelAnimationFrame(heroFrame);
    heroFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * -10}px`);
      hero.style.setProperty("--hero-y", `${(event.clientY - bounds.top - bounds.height / 2) / bounds.height * -7}px`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    cancelAnimationFrame(heroFrame);
    hero.style.setProperty("--hero-x", "0px"); hero.style.setProperty("--hero-y", "0px");
  });
  cards.forEach(card => {
    card.addEventListener("pointermove", event => {
      if (!enabled() || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
    card.addEventListener("pointerleave", () => { card.style.removeProperty("--spot-x"); card.style.removeProperty("--spot-y"); });
  });
  let scrollFrame;
  function progress() {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--read-progress", String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0));
    });
  }
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress, { passive: true });
  progress();
})();
