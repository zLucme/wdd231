document.addEventListener("DOMContentLoaded", () => {
  const anoSpan = document.getElementById("ano-copyright");
  const modificacaoSpan = document.getElementById("ultima-modificacao");
  const btnGrade = document.getElementById("btn-grade");
  const btnLista = document.getElementById("btn-lista");
  const container = document.getElementById("membros-container");
  const btnHamburguer = document.getElementById("btn-hamburguer");
  const listaMenu = document.getElementById("lista-menu");
  const btnModoEscuro = document.getElementById("modo-escuro");

  if (anoSpan) {
    anoSpan.textContent = new Date().getFullYear();
  }

  if (modificacaoSpan) {
    modificacaoSpan.textContent = document.lastModified;
  }

  if (btnHamburguer && listaMenu) {
    btnHamburguer.addEventListener("click", () => {
      listaMenu.classList.toggle("aberto");
    });
  }

  if (btnModoEscuro) {
    btnModoEscuro.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  async function carregarMembros() {
    try {
      const resposta = await fetch("dados/membros.json");
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      const membros = await resposta.json();
      renderizarMembros(membros);
    } catch (erro) {
      console.error(erro);
    }
  }

  function obterNivelTexto(nivel) {
    if (nivel === 3) return "Ouro";
    if (nivel === 2) return "Prata";
    return "Membro";
  }

  function renderizarMembros(membros) {
    container.innerHTML = "";

    membros.forEach((membro) => {
      const card = document.createElement("section");
      card.className = "cartao-membro";

      const cabecalhoCard = document.createElement("div");
      cabecalhoCard.className = "cartao-cabecalho";

      const titulo = document.createElement("h3");
      titulo.textContent = membro.nome;

      const slogan = document.createElement("p");
      slogan.className = "slogan";
      slogan.textContent = membro.slogan || membro.ramo;

      cabecalhoCard.appendChild(titulo);
      cabecalhoCard.appendChild(slogan);

      const corpoCard = document.createElement("div");
      corpoCard.className = "cartao-corpo";

      const imagem = document.createElement("img");
      imagem.src = `imagens/${membro.imagem}`;
      imagem.alt = `Logótipo de ${membro.nome}`;
      imagem.loading = "lazy";
      imagem.width = 120;
      imagem.height = 120;

      const dados = document.createElement("div");
      dados.className = "cartao-dados";

      const email = document.createElement("p");
      email.innerHTML = `<strong>E-MAIL:</strong> ${membro.email || "contato@empresa.com"}`;

      const telefone = document.createElement("p");
      telefone.innerHTML = `<strong>TELEFONE:</strong> ${membro.telefone}`;

      const site = document.createElement("p");
      site.innerHTML = `<strong>SITE:</strong> <a href="${membro.site}" target="_blank" rel="noopener noreferrer">${membro.site.replace(/^https?:\/\//, '')}</a>`;

      const nivel = document.createElement("p");
      nivel.className = `nivel nivel-${membro.nivel}`;
      nivel.textContent = `Nível: ${obterNivelTexto(membro.nivel)}`;

      dados.appendChild(email);
      dados.appendChild(telefone);
      dados.appendChild(site);
      dados.appendChild(nivel);

      corpoCard.appendChild(imagem);
      corpoCard.appendChild(dados);

      card.appendChild(cabecalhoCard);
      card.appendChild(corpoCard);

      container.appendChild(card);
    });
  }

  if (btnGrade && btnLista && container) {
    btnGrade.addEventListener("click", () => {
      container.classList.add("grid");
      container.classList.remove("list");
      btnGrade.classList.add("ativo");
      btnLista.classList.remove("ativo");
    });

    btnLista.addEventListener("click", () => {
      container.classList.add("list");
      container.classList.remove("grid");
      btnLista.classList.add("ativo");
      btnGrade.classList.remove("ativo");
    });
  }

  carregarMembros();
});