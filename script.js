(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const mobileSticky = document.getElementById("mobileSticky");
  const formSection = document.getElementById("formulario");
  let formIsVisible = false;

  const setMenuState = (isOpen) => {
    if (!burger || !mobileMenu) return;
    burger.classList.toggle("is-open", isOpen);
    mobileMenu.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    body.classList.toggle("menu-open", isOpen);
  };

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      setMenuState(!mobileMenu.classList.contains("open"));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
        setMenuState(false);
        burger.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.classList.contains("open")) return;
      if (!mobileMenu.contains(event.target) && !burger.contains(event.target)) {
        setMenuState(false);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 18);
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 650);
    if (mobileSticky) mobileSticky.classList.toggle("is-visible", scrollTop > 420 && !formIsVisible);
  };

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
  }, { passive: true });
  updateScrollUI();


  if (formSection && mobileSticky && "IntersectionObserver" in window) {
    const formVisibilityObserver = new IntersectionObserver((entries) => {
      formIsVisible = entries.some((entry) => entry.isIntersecting);
      updateScrollUI();
    }, { threshold: 0.08 });
    formVisibilityObserver.observe(formSection);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty("--rk-reveal-delay", `${delay}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = [...document.querySelectorAll('.rk-nav a[href^="#"]')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.05, 0.2, 0.45]
    });

    navSections.forEach((section) => navObserver.observe(section));
  }

  const heroCard = document.getElementById("heroCard");
  if (heroCard && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    heroCard.addEventListener("pointermove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
    });

    heroCard.addEventListener("pointerleave", () => {
      heroCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  document.querySelectorAll(".js-open-form").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById("formulario");
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        window.setTimeout(() => document.getElementById("empresa")?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 650);
      }
    });
  });

  const faqItems = document.querySelectorAll(".rk-faq-item");

  const closeFaq = (item) => {
    if (item._faqTimer) window.clearTimeout(item._faqTimer);
    const button = item.querySelector(".rk-faq-question");
    const answer = item.querySelector(".rk-faq-answer");
    if (!button || !answer || answer.hidden) return;

    button.setAttribute("aria-expanded", "false");
    item.classList.remove("is-open");
    answer.style.maxHeight = `${answer.scrollHeight}px`;
    requestAnimationFrame(() => {
      answer.style.maxHeight = "0px";
    });

    item._faqTimer = window.setTimeout(() => {
      answer.hidden = true;
      answer.style.maxHeight = "";
      item._faqTimer = null;
    }, prefersReducedMotion ? 0 : 360);
  };

  const openFaq = (item) => {
    if (item._faqTimer) {
      window.clearTimeout(item._faqTimer);
      item._faqTimer = null;
    }
    const button = item.querySelector(".rk-faq-question");
    const answer = item.querySelector(".rk-faq-answer");
    if (!button || !answer) return;

    faqItems.forEach((other) => {
      if (other !== item) closeFaq(other);
    });

    answer.hidden = false;
    answer.style.maxHeight = "0px";
    button.setAttribute("aria-expanded", "true");
    item.classList.add("is-open");

    requestAnimationFrame(() => {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    });
  };

  faqItems.forEach((item) => {
    const button = item.querySelector(".rk-faq-question");
    const answer = item.querySelector(".rk-faq-answer");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      if (isOpen) closeFaq(item);
      else openFaq(item);
    });
  });

  const form = document.getElementById("leadForm");
  const cnpjInput = document.getElementById("cnpj");
  const whatsappInput = document.getElementById("whatsapp");
  const valueInput = document.getElementById("valor");
  const formProgress = document.getElementById("formProgress");
  const formProgressText = document.getElementById("formProgressText");
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("submitButton");

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const formatCnpj = (value) => {
    const digits = onlyDigits(value).slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const formatPhone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatCurrency = (value) => {
    const digits = onlyDigits(value).slice(0, 14);
    if (!digits) return "";
    const amount = Number(digits) / 100;
    return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const isValidCnpj = (value) => {
    const cnpj = onlyDigits(value);
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const calculateDigit = (base, weights) => {
      const sum = base.split("").reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
      const result = sum % 11;
      return result < 2 ? 0 : 11 - result;
    };

    const first = calculateDigit(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
    const second = calculateDigit(cnpj.slice(0, 12) + first, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
    return cnpj.endsWith(`${first}${second}`);
  };

  cnpjInput?.addEventListener("input", () => {
    cnpjInput.value = formatCnpj(cnpjInput.value);
    cnpjInput.setCustomValidity("");
  });

  cnpjInput?.addEventListener("blur", () => {
    if (cnpjInput.value && !isValidCnpj(cnpjInput.value)) {
      cnpjInput.setCustomValidity("Informe um CNPJ válido.");
    } else {
      cnpjInput.setCustomValidity("");
    }
  });

  whatsappInput?.addEventListener("input", () => {
    whatsappInput.value = formatPhone(whatsappInput.value);
  });

  valueInput?.addEventListener("input", () => {
    valueInput.value = formatCurrency(valueInput.value);
  });

  const updateFormProgress = () => {
    if (!form) return;
    const requiredFields = [...form.querySelectorAll("[required]")];
    const completed = requiredFields.filter((field) => {
      if (field.type === "checkbox") return field.checked;
      return String(field.value || "").trim().length > 0;
    }).length;
    const percentage = requiredFields.length ? Math.round((completed / requiredFields.length) * 100) : 0;

    if (formProgress) formProgress.style.width = `${percentage}%`;
    if (formProgressText) formProgressText.textContent = `${percentage}% preenchido`;
  };

  form?.addEventListener("input", updateFormProgress);
  form?.addEventListener("change", updateFormProgress);
  updateFormProgress();

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cnpjInput?.value && !isValidCnpj(cnpjInput.value)) {
      cnpjInput.setCustomValidity("Informe um CNPJ válido.");
    }

    if (!form.reportValidity()) {
      if (formStatus) formStatus.textContent = "Revise os campos obrigatórios antes de continuar.";
      return;
    }

    const data = new FormData(form);
    const empresa = String(data.get("empresa") || "").trim();
    const cnpj = String(data.get("cnpj") || "").trim();
    const segmento = String(data.get("segmento") || "").trim();
    const valor = String(data.get("valor") || "").trim();
    const prazo = String(data.get("prazo") || "").trim();
    const responsavel = String(data.get("responsavel") || "").trim();
    const whatsapp = String(data.get("whatsapp") || "").trim();
    const email = String(data.get("email") || "").trim();

    const message = [
      "Olá, gostaria de solicitar uma análise de antecipação de nota fiscal com a RK Factoring.",
      "",
      `Empresa: ${empresa}`,
      `CNPJ: ${cnpj}`,
      `Segmento: ${segmento}`,
      `Valor aproximado: ${valor}`,
      `Prazo para recebimento: ${prazo}`,
      `Responsável: ${responsavel}`,
      `WhatsApp: ${whatsapp}`,
      email ? `E-mail: ${email}` : null
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/5511941512192?text=${encodeURIComponent(message)}`;

    if (submitButton) submitButton.classList.add("is-loading");
    if (formStatus) formStatus.textContent = "Preparando sua mensagem para o WhatsApp...";

    window.setTimeout(() => {
      window.location.href = url;
    }, prefersReducedMotion ? 0 : 450);
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
})();
