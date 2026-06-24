const root = document.documentElement;
const glow = document.querySelector(".cursor-glow");

const timelineContent = [
  {
    title: "Comece pelos cadastros e documentos",
    text:
      "A preparacao inicial passa por revisar dados fiscais, parametrizacoes, classificacoes de produtos e fluxos de emissao de notas.",
  },
  {
    title: "A fase de 1% serve para aprender com dados reais",
    text:
      "Mesmo com carga reduzida, esse periodo ajuda a validar sistemas, relatorios e conciliacoes antes da operacao completa.",
  },
  {
    title: "PIS e Cofins saem de cena",
    text:
      "A substituicao exige revisar precificacao, creditos, documentos fiscais e regras internas que hoje dependem desses tributos.",
  },
  {
    title: "ICMS e ISS perdem espaco gradualmente",
    text:
      "Durante a convivencia entre regimes, sera importante acompanhar impactos por produto, localidade e tipo de operacao.",
  },
  {
    title: "IBS e CBS passam a comandar o consumo",
    text:
      "No modelo final, a gestao fiscal fica mais conectada ao destino, ao documento e ao fluxo financeiro da operacao.",
  },
];

const profileContent = {
  "nao-contribuinte": {
    label: "Regime diferenciado",
    title: "Credito presumido pode ganhar relevancia",
    text:
      "Para aquisicoes de produtor rural nao contribuinte, a legislacao preve credito presumido ao adquirente. O percentual ainda precisa de definicao operacional.",
  },
  contribuinte: {
    label: "Faturamento acima de R$ 3,6 milhoes",
    title: "A obrigacao fiscal fica mais parecida com a de empresas",
    text:
      "Produtores acima do limite devem acompanhar apuracao, documentos, creditos, controles e impacto no preco com uma rotina fiscal mais estruturada.",
  },
};

function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function updateProgress() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  root.style.setProperty("--progress", `${progress}%`);
}

function updateSplitPayment() {
  const amount = Number(document.querySelector("#amount").value);
  const cbs = amount * 0.093;
  const ibs = amount * 0.187;
  const net = amount - cbs - ibs;

  document.querySelector("#amount-output").textContent = formatBRL(amount);
  document.querySelector("#cbs-value").textContent = formatBRL(cbs);
  document.querySelector("#ibs-value").textContent = formatBRL(ibs);
  document.querySelector("#net-value").textContent = formatBRL(net);
}

document.addEventListener("pointermove", (event) => {
  if (!glow) return;
  root.style.setProperty("--x", `${event.clientX}px`);
  root.style.setProperty("--y", `${event.clientY}px`);
});

document.querySelectorAll(".timeline-step").forEach((button, index) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".timeline-step")
      .forEach((step) => step.classList.toggle("is-active", step === button));

    const copy = document.querySelector(".timeline-copy");
    copy.innerHTML = `<h3>${timelineContent[index].title}</h3><p>${timelineContent[index].text}</p>`;
  });
});

document.querySelectorAll(".profile-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const profile = profileContent[button.dataset.profile];

    document
      .querySelectorAll(".profile-tab")
      .forEach((tab) => tab.classList.toggle("is-active", tab === button));

    document.querySelector("#profile-card").innerHTML = `
      <span class="profile-label">${profile.label}</span>
      <h3>${profile.title}</h3>
      <p>${profile.text}</p>
    `;
  });
});

document.querySelector("#amount").addEventListener("input", updateSplitPayment);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll(".section-panel > *").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
updateSplitPayment();
