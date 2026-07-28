/* ============================================
   ARYAN VX7 — Shared UI Effects
   Custom cursor, particle background, loading screen,
   toast notifications, ripple + tilt effects, scroll reveal
   ============================================ */

/* ---------------- Loading screen ---------------- */
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      screen.classList.add("hidden");
      console.log("[ui] Loading screen dismissed");
    }, 700);
  });
}

/* ---------------- Custom cursor ---------------- */
function initCustomCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button, .service-card, .action-card, .tilt").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("active"));
  });

  console.log("[ui] Custom cursor initialized");
}

/* ---------------- Particle background ---------------- */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const count = Math.min(70, Math.floor((width * height) / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.6 + 0.4,
    vy: Math.random() * 0.3 + 0.08,
    vx: (Math.random() - 0.5) * 0.15,
    hue: Math.random() > 0.5 ? "212,168,67" : "30,144,255",
    alpha: Math.random() * 0.5 + 0.15
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  draw();

  console.log(`[ui] Particle background initialized with ${count} particles`);
}

/* ---------------- Toast notifications ---------------- */
function ensureToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "info", duration = 3800) {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ---------------- Ripple effect on buttons ---------------- */
function initRippleEffect() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 650);
  });
}

/* ---------------- Tilt effect on cards ---------------- */
function initTiltEffect() {
  const cards = document.querySelectorAll(".service-card, .action-card, .why-visual");
  cards.forEach((card) => {
    card.classList.add("tilt");
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", `0deg`);
      card.style.setProperty("--tilt-y", `0deg`);
    });
  });
}

/* ---------------- Scroll reveal (Intersection Observer) ---------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
  console.log(`[ui] Scroll reveal watching ${targets.length} elements`);
}

/* ---------------- Init everything shared across pages ---------------- */
function initSharedUI() {
  initLoadingScreen();
  initCustomCursor();
  initParticles();
  initRippleEffect();
  initTiltEffect();
  initScrollReveal();
}

document.addEventListener("DOMContentLoaded", initSharedUI);
