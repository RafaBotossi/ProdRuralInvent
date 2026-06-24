const root = document.documentElement;
const glow = document.querySelector(".cursor-glow");

const timelineContent = [
  {
    title: "2025: preparação normativa e técnica",
    text:
      "O cronograma apresentado começa com primeiras notas técnicas e preparação dos sistemas. É a hora de revisar cadastros, parametrizações, classificações de produtos e fluxos de emissão de notas.",
  },
  {
    title: "2026: testes com alíquota experimental",
    text:
      "A fase de testes com alíquota de 1% ajuda a validar sistemas, relatórios e conciliações antes de a operação ganhar impacto mais relevante no caixa.",
  },
  {
    title: "2027: PIS e Cofins saem de cena",
    text:
      "A substituição exige revisar precificação, créditos, documentos fiscais e regras internas que hoje dependem desses tributos.",
  },
  {
    title: "2028 a 2032: convivência e virada gradual",
    text:
      "O período concentra ajustes de convivência e a transição entre IBS/CBS e ICMS/ISS. Será importante acompanhar impactos por produto, localidade e tipo de operação.",
  },
  {
    title: "2033: IBS e CBS chegam a 100% do novo modelo",
    text:
      "No modelo final, a gestão fiscal fica mais conectada ao destino, ao documento e ao fluxo financeiro da operação.",
  },
];

const profileContent = {
  "nao-contribuinte": {
    label: "Regime diferenciado",
    title: "Crédito presumido pode ganhar relevância",
    text:
      "Para aquisições de produtor rural não contribuinte, a legislação prevê crédito presumido ao adquirente. O percentual ainda precisa de definição operacional.",
  },
  contribuinte: {
    label: "Faturamento acima de R$ 3,6 milhões",
    title: "A obrigação fiscal fica mais parecida com a de empresas",
    text:
      "Produtores acima do limite devem acompanhar apuração, documentos, créditos, controles e impacto no preço com uma rotina fiscal mais estruturada.",
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
