const sectionsToRender = [
  { id: "header", path: "./sections/header.html" },
  { id: "footer", path: "./sections/footer.html" },
];

const html = document.documentElement;

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
html.setAttribute("data-theme", savedTheme);

async function initPage() {
  await renderSections(sectionsToRender);

  /* ── Footer year ── */
  const yearElement = document.getElementById("footerYear");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  /* ── Theme toggle ── */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    });
  }

  /* ── Mobile hamburger menu ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    function closeMenu() {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    });
  }

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }

  /* ── Active nav link: highlight current page ── */
  const navLinkEls = document.querySelectorAll(".nav-link");
  const currentFile = window.location.pathname.split("/").pop() || "";

  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkFile = href.split("/").pop() || "";
    const isCurrentPage =
      linkFile === currentFile ||
      (linkFile === "" && (currentFile === "" || currentFile === "index.html"));
    link.classList.toggle("active", isCurrentPage);
  });

  /* ── Scroll animations (progressive enhancement) ── */
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  const staggerGroups = [
    // .project-card excluded: it now lives in a Swiper carousel where off-screen
    // slides never intersect the viewport and would stay hidden (opacity:0).
    { selector: ".testimonial-card", delay: 0.15 },
    { selector: ".skill-category", delay: 0.1 },
  ];

  staggerGroups.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("animate-on-scroll");
      el.style.transitionDelay = `${i * delay}s`;
      scrollObserver.observe(el);
    });
  });

  document
    .querySelectorAll(".about-bio, .contact-item, .section-header, .hero-stats")
    .forEach((el) => {
      el.classList.add("animate-on-scroll");
      scrollObserver.observe(el);
    });

  /* ── Contact form validation ── */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm) {
    function validate(id, errorId, check, msg) {
      const field = document.getElementById(id);
      const err = document.getElementById(errorId);
      const ok = check(field.value.trim());
      field.classList.toggle("error", !ok);
      err.textContent = ok ? "" : msg;
      return ok;
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [
        validate("name", "nameError", (v) => v.length >= 2, "Name must be at least 2 characters."),
        validate(
          "email",
          "emailError",
          (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          "Please enter a valid email address.",
        ),
        validate(
          "message",
          "messageError",
          (v) => v.length >= 10,
          "Message must be at least 10 characters.",
        ),
      ].every(Boolean);

      if (ok) {
        formSuccess.hidden = false;
        contactForm.reset();
        setTimeout(() => {
          formSuccess.hidden = true;
        }, 5000);
      }
    });

    ["name", "email", "message"].forEach((id) => {
      document.getElementById(id).addEventListener("input", () => {
        document.getElementById(id).classList.remove("error");
        document.getElementById(`${id}Error`).textContent = "";
      });
    });
  }
}

initPage();
