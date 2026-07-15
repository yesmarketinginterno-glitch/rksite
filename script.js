// Menu mobile
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

// Rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId.length > 1) {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Cards -> preencher tipo do recebível e descer para o formulário
document.querySelectorAll(".js-open-form").forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.dataset.type;
    const select = document.getElementById("tipoRecebivel");
    if (select && tipo) {
      select.value = tipo;
    }
    const formSection = document.getElementById("formulario");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// FAQ accordion
document.querySelectorAll(".rk-faq-item").forEach(item => {
  const btn = item.querySelector(".rk-faq-question");
  if (!btn) return;
  btn.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

// Formulário -> ir direto para o WhatsApp com os dados
const form = document.getElementById("leadForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const empresa = (data.get("empresa") || "").trim();
    const cnpj = (data.get("cnpj") || "").trim();
    const segmento = (data.get("segmento") || "").trim();
    const tipo = (data.get("tipo") || "").trim();
    const valor = (data.get("valor") || "").trim();
    const prazo = (data.get("prazo") || "").trim();
    const responsavel = (data.get("responsavel") || "").trim();
    const contato = (data.get("contato") || "").trim();

    let texto =
      `Olá, sou ${responsavel} da empresa ${empresa} (CNPJ: ${cnpj}).\n` +
      `Segmento: ${segmento}.\n` +
      `Tipo de recebível: ${tipo}.\n` +
      `Valor aproximado para antecipar: ${valor}.\n` +
      `Prazo médio de recebimento: ${prazo}.\n` +
      `Contato: ${contato}.\n` +
      `Gostaria de solicitar uma análise de antecipação de recebíveis com a RK Factoring.`;

    texto = encodeURIComponent(texto);
    const numero = "5511941512192";
    const waUrl = `https://wa.me/${numero}?text=${texto}`;

    window.location.href = waUrl;
  });
}
