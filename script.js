(function () {
  "use strict";

  /* ---------- Header scroll state + thread progress ---------- */
  const header = document.getElementById("siteHeader");
  const progressFill = document.getElementById("threadProgress");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav drawer ---------- */
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("mobileDrawer");

  function closeDrawer() {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
  }

  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
  });

  drawer.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeDrawer)
  );

  /* ---------- Scroll reveal + thread-weave divider animation ---------- */
  const revealTargets = document.querySelectorAll(".reveal");
  const threadTargets = document.querySelectorAll("[data-thread]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  const threadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-woven");
          threadObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  threadTargets.forEach((el) => threadObserver.observe(el));

  /* ---------- Swatch colourway switcher ---------- */
  document.querySelectorAll(".p-card").forEach((card) => {
    const dots = card.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => {
        const c1 = dot.getAttribute("data-c1");
        const c2 = dot.getAttribute("data-c2");
        card.style.setProperty("--c1", c1);
        card.style.setProperty("--c2", c2);
        dots.forEach((d) => d.classList.remove("is-active"));
        dot.classList.add("is-active");
      });
    });
  });

  /* ---------- Cart / add to bag ---------- */
  const cartCountEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  let cartCount = 0;
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll(".add-bag").forEach((btn) => {
    btn.addEventListener("click", () => {
      cartCount += 1;
      cartCountEl.textContent = String(cartCount);
      const name = btn.getAttribute("data-name") || "Item";
      showToast(`Added to bag — ${name}`);

      btn.classList.add("is-added");
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.classList.remove("is-added");
        btn.textContent = original;
      }, 1400);
    });
  });

  /* ---------- Newsletter form ---------- */
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");
  const emailInput = document.getElementById("nlEmail");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid) {
      msg.textContent = "That doesn't look like a valid email — try again.";
      msg.style.color = "#E0745A";
      return;
    }

    msg.textContent = "You're on the list. Watch for the next drop.";
    msg.style.color = "#C9A227";
    form.reset();
  });

  /* ---------- Back to top ---------- */
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
