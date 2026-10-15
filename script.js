const socialProfiles = [
  { name: "YouTube", label: "gdsakib67", placeholder: "ADD CHANNEL URL IN script.js", mark: "▶", url: "" },
  { name: "Discord", label: "YOUR COMMUNITY", placeholder: "ADD INVITE URL IN script.js", mark: "◈", url: "" },
  { name: "GitHub", label: "YOUR CODE", mark: "⌘", url: "" },
  { name: "Roblox", label: "YOUR PROFILE", mark: "", icon: "./assets/icons/roblox-mark.svg", url: "" }
];

const socialGrid = document.querySelector("#social-grid");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = [...document.querySelectorAll(".nav-link")];
const header = document.querySelector(".site-header");
const backTopButton = document.querySelector(".back-top-button");
const progressBar = document.querySelector(".scroll-progress-bar");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function isUsableUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch (error) {
    return false;
  }
}

function renderSocialProfiles() {
  for (const profile of socialProfiles) {
    const hasUrl = isUsableUrl(profile.url);
    const card = document.createElement(hasUrl ? "a" : "div");
    card.className = `social-card social-card-${profile.name.toLowerCase()}${hasUrl ? "" : " social-card-placeholder"}`;
    if (hasUrl) {
      card.href = profile.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `${profile.name} profile (opens in a new tab)`);
    }

    const icon = document.createElement("span");
    icon.className = "social-icon";
    icon.setAttribute("aria-hidden", "true");
    if (profile.icon) {
      const iconImage = document.createElement("img");
      iconImage.src = profile.icon;
      iconImage.alt = "";
      iconImage.className = "social-icon-image";
      icon.append(iconImage);
    } else {
      icon.textContent = profile.mark;
    }
    const description = document.createElement("span");
    const name = document.createElement("span");
    name.className = "social-label";
    name.textContent = profile.name;
    const label = document.createElement("span");
    label.className = "social-value";
    label.textContent = profile.label;
    description.append(name, label);
    if (!hasUrl && profile.placeholder) {
      const placeholder = document.createElement("span");
      placeholder.className = "social-config-note";
      placeholder.textContent = profile.placeholder;
      description.append(placeholder);
    }
    card.append(icon, description);
    if (hasUrl) {
      const arrow = document.createElement("span");
      arrow.className = "social-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      card.append(arrow);
    }
    socialGrid.append(card);
  }
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navItems.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (navLinks.classList.contains("is-open") && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const navIndicator = document.querySelector(".nav-indicator");
function moveNavIndicator(link) {
  if (!link || !navIndicator || window.matchMedia("(max-width: 640px)").matches) return;
  navIndicator.style.width = `${link.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
}

navItems.forEach((link) => link.addEventListener("focus", () => moveNavIndicator(link)));
const sections = navItems.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const activeLink = navItems.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
      if (activeLink) {
        navItems.forEach((link) => link.classList.toggle("is-active", link === activeLink));
        moveNavIndicator(activeLink);
      }
    }
  }, { rootMargin: "-38% 0px -52% 0px", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function updateScrollControls() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", scrolled);
  backTopButton.classList.toggle("is-visible", window.scrollY > 420);
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0})`;
}
window.addEventListener("scroll", updateScrollControls, { passive: true });
window.addEventListener("resize", () => {
  moveNavIndicator(navItems.find((link) => link.classList.contains("is-active")));
  if (window.innerWidth > 640) closeMenu();
});
updateScrollControls();

backTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" }));
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Clipboard copy is unavailable in this browser.");
}

document.querySelectorAll("[data-copy-uid]").forEach((button) => {
  button.addEventListener("click", async () => {
    const feedback = button.closest(".ff-card").querySelector(".copy-feedback");
    const uid = button.dataset.copyUid;
    try {
      await copyText(uid);
      feedback.textContent = "UID COPIED!";
      feedback.classList.remove("copy-error");
      button.classList.add("is-copied");
      button.innerHTML = 'UID COPIED! <span aria-hidden="true">✓</span>';
    } catch (error) {
      feedback.textContent = `Could not copy automatically. Select UID ${uid} and copy it manually.`;
      feedback.classList.add("copy-error");
      console.error("Unable to copy the Free Fire UID.", error);
    }
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.innerHTML = 'COPY UID <span aria-hidden="true">⧉</span>';
    }, 2600);
    window.setTimeout(() => { feedback.textContent = ""; }, 5000);
  });
});

const tiltCards = document.querySelectorAll(".tilt-card");
if (!reducedMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 4}deg) translateY(-3px)`;
      card.style.setProperty("--shine-x", `${x * 100}%`);
      card.style.setProperty("--shine-y", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const cursorLight = document.querySelector(".cursor-light");
  let pointerFrame = 0;
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      cursorLight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      pointerFrame = 0;
    });
  }, { passive: true });
}

function startParticles() {
  const canvas = document.querySelector(".particle-canvas");
  const context = canvas.getContext("2d", { alpha: true });
  if (!context || reducedMotion.matches) return;

  const particles = [];
  const particleCount = Math.min(32, Math.max(18, Math.floor(window.innerWidth / 38)));
  let width = 0;
  let height = 0;
  let lastFrame = 0;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  for (let index = 0; index < particleCount; index += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.7 + Math.random() * 1.5,
      speed: 0.08 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? 190 : 270
    });
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  function draw(timestamp) {
    if (document.hidden) return;
    if (timestamp - lastFrame < 32) {
      window.requestAnimationFrame(draw);
      return;
    }
    lastFrame = timestamp;
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      if (!reducedMotion.matches) {
        particle.y -= particle.speed;
        particle.phase += 0.008;
        if (particle.y < -5) {
          particle.y = height + 5;
          particle.x = Math.random() * width;
        }
      }
      const alpha = 0.18 + (Math.sin(particle.phase) + 1) * 0.16;
      context.beginPath();
      context.fillStyle = `hsla(${particle.hue}, 90%, 75%, ${alpha})`;
      context.shadowColor = `hsla(${particle.hue}, 90%, 70%, .45)`;
      context.shadowBlur = 8;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.shadowBlur = 0;
    window.requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !reducedMotion.matches) window.requestAnimationFrame(draw);
  });
}

startParticles();
renderSocialProfiles();

const robloxSocialProfile = socialProfiles.find((profile) => profile.name === "Roblox");
const robloxProfilePlaceholder = document.querySelector("#roblox-profile-link");
if (robloxProfilePlaceholder && isUsableUrl(robloxSocialProfile.url)) {
  const profileLink = document.createElement("a");
  profileLink.className = "roblox-profile-link";
  profileLink.href = robloxSocialProfile.url;
  profileLink.target = "_blank";
  profileLink.rel = "noopener noreferrer";
  profileLink.textContent = "VIEW ROBLOX PROFILE ↗";
  robloxProfilePlaceholder.replaceWith(profileLink);
}
