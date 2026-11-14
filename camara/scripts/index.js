document.addEventListener("DOMContentLoaded", () => {
  const anoSpan = document.getElementById("ano-copyright");
  const modificacaoSpan = document.getElementById("ultima-modificacao");
  const btnHamburguer = document.getElementById("btn-hamburguer");
  const listaMenu = document.getElementById("lista-menu");
  const btnModoEscuro = document.getElementById("modo-escuro");

  if (anoSpan) anoSpan.textContent = new Date().getFullYear();
  if (modificacaoSpan) modificacaoSpan.textContent = document.lastModified;

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

  const botaoCta = document.querySelector(".botao-cta");
  if (botaoCta) {
    botaoCta.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  const apiKey = "7389903b1bece2f22732550305d5e108";
  const lat = "-22.4431";
  const lon = -47.3114;
  const urlClimaAtual = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
  const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;

  async function carregarDadosClima() {
    const climaContainer = document.getElementById("clima-container");
    if (!climaContainer) return;

    try {
      const [respostaAtual, respostaPrevisao] = await Promise.all([
        fetch(urlClimaAtual),
        fetch(urlPrevisao)
      ]);

      if (!respostaAtual.ok || !respostaPrevisao.ok) {
        throw new Error("Erro ao buscar dados meteorológicos.");
      }

      const dadosAtual = await respostaAtual.json();
      const dadosPrevisao = await respostaPrevisao.json();

      const tempAtual = Math.round(dadosAtual.main.temp);
      const descricao = dadosAtual.weather[0].description;
      const descricaoFormatada = descricao.charAt(0).toUpperCase() + descricao.slice(1);

      const previsoesDiarias = dadosPrevisao.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

      let htmlPrevisao = `
        <div class="clima-atual">
          <p><strong>Temperatura Atual:</strong> ${tempAtual}°C</p>
          <p><strong>Condição:</strong> ${descricaoFormatada}</p>
        </div>
        <div class="clima-previsao">
          <h3>Previsão para os Próximos 3 Dias:</h3>
          <ul>
      `;

      previsoesDiarias.forEach(dia => {
        const dataObj = new Date(dia.dt * 1000);
        const nomeDia = dataObj.toLocaleDateString("pt-BR", { weekday: 'long', day: '2-digit', month: '2-digit' });
        const tempMax = Math.round(dia.main.temp_max);
        const tempMin = Math.round(dia.main.temp_min);
        const cond = dia.weather[0].description;
        
        htmlPrevisao += `<li><strong>${nomeDia}:</strong> ${tempMax}°C / ${tempMin}°C - ${cond}</li>`;
      });

      htmlPrevisao += `</ul></div>`;
      climaContainer.innerHTML = htmlPrevisao;

    } catch (erro) {
      console.error("Erro no clima:", erro);
      climaContainer.innerHTML = "<p>Não foi possível carregar os dados meteorológicos no momento.</p>";
    }
  }

  async function carregarEmpresasDestaque() {
    const destaquesContainer = document.getElementById("destaques-container");
    if (!destaquesContainer) return;

    try {
      const resposta = await fetch("dados/membros.json");
      if (!resposta.ok) throw new Error("Erro ao carregar arquivo de membros.");
      
      const membros = await resposta.json();

      const qualificados = membros.filter(m => m.nivel === 2 || m.nivel === 3);

      qualificados.sort(() => Math.random() - 0.5);

      const quantidade = Math.random() < 0.5 ? 2 : 3;
      const selecionados = qualificados.slice(0, quantidade);

      destaquesContainer.innerHTML = "";

      selecionados.forEach(membro => {
        const cartao = document.createElement("section");
        cartao.className = "cartao-membro";

        const nivelTexto = membro.nivel === 3 ? "Ouro" : "Prata";

        cartao.innerHTML = `
          <div class="cartao-cabecalho">
            <h2>${membro.nome}</h2>
            <p class="slogan">${membro.slogan || membro.ramo}</p>
          </div>
          <div class="cartao-corpo">
            <img src="imagens/${membro.imagem}" alt="Logótipo de ${membro.nome}" loading="lazy" width="90" height="90">
            <div class="cartao-dados">
              <p><strong>E-MAIL:</strong> ${membro.email || "contato@empresa.com"}</p>
              <p><strong>TELEFONE:</strong> ${membro.telefone}</p>
              <p><strong>SITE:</strong> <a href="${membro.site}" target="_blank" rel="noopener noreferrer">${membro.site.replace(/^https?:\/\//, '')}</a></p>
              <p class="nivel nivel-${membro.nivel}">Nível: ${nivelTexto}</p>
            </div>
          </div>
        `;
        destaquesContainer.appendChild(cartao);
      });

    } catch (erro) {
      console.error("Erro ao carregar destaques:", erro);
      destaquesContainer.innerHTML = "<p>Não foi possível carregar as empresas em destaque.</p>";
    }
  }

  carregarDadosClima();
  carregarEmpresasDestaque();
});