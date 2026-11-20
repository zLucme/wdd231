document.addEventListener("DOMContentLoaded", () => {
  const anoSpan = document.getElementById("ano-copyright");
  const modificacaoSpan = document.getElementById("ultima-modificacao");
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
      const aberto = listaMenu.classList.toggle("aberto");
      btnHamburguer.setAttribute("aria-expanded", String(aberto));
    });
  }

  if (btnModoEscuro) {
    btnModoEscuro.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  const campoTimestamp = document.getElementById("timestamp");
  const formulario = document.getElementById("form-associacao");

  function atualizarTimestamp() {
    if (campoTimestamp) {
      campoTimestamp.value = new Date().toISOString();
    }
  }

  atualizarTimestamp();

  const mensagensErro = {
    nome: "Por favor, informe o seu primeiro nome.",
    sobrenome: "Por favor, informe o seu sobrenome.",
    cargo: "O cargo deve ter pelo menos 7 caracteres e usar apenas letras, espaços ou hífens.",
    email: "Por favor, informe um endereço de e-mail válido (ex.: nome@empresa.com.br).",
    telefone: "Por favor, informe um telefone celular válido com DDD.",
    empresa: "Por favor, informe o nome da empresa ou organização.",
    nivel: "Por favor, selecione um nível de associação."
  };

  function validarCampo(campo) {
    const spanErro = document.getElementById(`erro-${campo.id}`);
    if (!spanErro) return true;

    const valorLimpo = campo.value.trim();
    let valido = true;

    if (campo.hasAttribute("required") && valorLimpo === "") {
      valido = false;
    } else if (valorLimpo !== "" && !campo.checkValidity()) {
      valido = false;
    }

    if (!valido) {
      campo.setAttribute("aria-invalid", "true");
      spanErro.textContent = mensagensErro[campo.id] || campo.validationMessage;
    } else {
      campo.removeAttribute("aria-invalid");
      spanErro.textContent = "";
    }

    return valido;
  }

  if (formulario) {
    const camposValidaveis = formulario.querySelectorAll("input:not([type='hidden']), select");

    camposValidaveis.forEach((campo) => {
      campo.addEventListener("blur", () => {
        validarCampo(campo);
      });

      campo.addEventListener("input", () => {
        if (campo.getAttribute("aria-invalid") === "true") {
          validarCampo(campo);
        }
      });
    });

    formulario.addEventListener("submit", (evento) => {
      atualizarTimestamp();
      let primeiroInvalido = null;

      camposValidaveis.forEach((campo) => {
        const valido = validarCampo(campo);
        if (!valido && !primeiroInvalido) {
          primeiroInvalido = campo;
        }
      });

      if (primeiroInvalido) {
        evento.preventDefault();
        primeiroInvalido.focus();
      }
    });
  }

  const trilhoNiveis = document.getElementById("trilho-niveis");
  const cartoesNivel = document.querySelectorAll("#trilho-niveis .cartao-nivel");
  const btnAnterior = document.getElementById("btn-nivel-anterior");
  const btnProximo = document.getElementById("btn-nivel-proximo");
  const indicadores = document.querySelectorAll(".indicador-carrossel");
  const contadorCarrossel = document.getElementById("contador-carrossel");
  let indiceAtual = 0;

  function atualizarCarrossel(novoIndice) {
    if (!trilhoNiveis || cartoesNivel.length === 0) return;

    const total = cartoesNivel.length;
    indiceAtual = (novoIndice + total) % total;
    trilhoNiveis.setAttribute("data-slide", String(indiceAtual));

    cartoesNivel.forEach((cartao, indice) => {
      const ativo = indice === indiceAtual;
      cartao.setAttribute("aria-hidden", String(!ativo));
      const botaoCard = cartao.querySelector(".botao-modal");
      if (botaoCard) {
        botaoCard.tabIndex = ativo ? 0 : -1;
      }
    });

    indicadores.forEach((indicador, indice) => {
      const ativo = indice === indiceAtual;
      indicador.classList.toggle("ativo", ativo);
      if (ativo) {
        indicador.setAttribute("aria-current", "true");
      } else {
        indicador.removeAttribute("aria-current");
      }
    });

    if (contadorCarrossel) {
      contadorCarrossel.textContent = `Plano ${indiceAtual + 1} de ${total}`;
    }
  }

  if (trilhoNiveis && cartoesNivel.length > 0) {
    atualizarCarrossel(0);

    if (btnAnterior) {
      btnAnterior.addEventListener("click", () => {
        atualizarCarrossel(indiceAtual - 1);
      });
    }

    if (btnProximo) {
      btnProximo.addEventListener("click", () => {
        atualizarCarrossel(indiceAtual + 1);
      });
    }

    indicadores.forEach((indicador) => {
      indicador.addEventListener("click", () => {
        const indice = Number(indicador.getAttribute("data-indice"));
        if (!Number.isNaN(indice)) {
          atualizarCarrossel(indice);
        }
      });
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;

      const modalAberto = document.querySelector("dialog.modal-nivel[open]");
      if (modalAberto) return;

      const elementoFocado = document.activeElement;
      const tagFocada = elementoFocado ? elementoFocado.tagName : "";
      if (tagFocada === "INPUT" || tagFocada === "TEXTAREA" || tagFocada === "SELECT") {
        return;
      }

      evento.preventDefault();
      if (evento.key === "ArrowLeft") {
        atualizarCarrossel(indiceAtual - 1);
      } else {
        atualizarCarrossel(indiceAtual + 1);
      }
    });
  }

  let ultimoBotaoModal = null;
  const botoesAbrirModal = document.querySelectorAll("[data-modal]");

  botoesAbrirModal.forEach((botao) => {
    botao.addEventListener("click", () => {
      const idModal = botao.getAttribute("data-modal");
      const modal = document.getElementById(idModal);
      if (modal && typeof modal.showModal === "function") {
        ultimoBotaoModal = botao;
        modal.showModal();
      }
    });
  });

  const modais = document.querySelectorAll("dialog.modal-nivel");

  modais.forEach((modal) => {
    const botaoFechar = modal.querySelector("[data-fechar-modal]");

    if (botaoFechar) {
      botaoFechar.addEventListener("click", () => {
        modal.close();
      });
    }

    modal.addEventListener("click", (evento) => {
      const retaguarda = modal.getBoundingClientRect();
      const clicouFora =
        evento.clientX < retaguarda.left ||
        evento.clientX > retaguarda.right ||
        evento.clientY < retaguarda.top ||
        evento.clientY > retaguarda.bottom;

      if (clicouFora) {
        modal.close();
      }
    });

    modal.addEventListener("close", () => {
      if (ultimoBotaoModal && typeof ultimoBotaoModal.focus === "function") {
        ultimoBotaoModal.focus();
        ultimoBotaoModal = null;
      }
    });
  });

  const resumoContainer = document.getElementById("resumo-associacao");

  if (resumoContainer) {
    const parametros = new URLSearchParams(window.location.search);

    const nome = parametros.get("nome")?.trim() || "";
    const sobrenome = parametros.get("sobrenome")?.trim() || "";
    const nomeCompleto = `${nome} ${sobrenome}`.trim() || "Não informado";

    const nomesNivel = {
      np: "NP — Sem Fins Lucrativos (Isento)",
      bronze: "Nível Bronze",
      silver: "Nível Prata",
      gold: "Nível Ouro"
    };

    const nivelParam = parametros.get("nivel")?.trim() || "";
    const nivelFormatado = nomesNivel[nivelParam.toLowerCase()] || nivelParam || "Não informado";

    const definirTexto = (idElemento, valorPadrao) => {
      const elemento = document.getElementById(idElemento);
      if (elemento) {
        elemento.textContent = valorPadrao;
      }
    };

    definirTexto("resumo-nome", nomeCompleto);
    definirTexto("resumo-cargo", parametros.get("cargo")?.trim() || "Não informado");
    definirTexto("resumo-email", parametros.get("email")?.trim() || "Não informado");
    definirTexto("resumo-telefone", parametros.get("telefone")?.trim() || "Não informado");
    definirTexto("resumo-empresa", parametros.get("empresa")?.trim() || "Não informado");
    definirTexto("resumo-nivel", nivelFormatado);
    definirTexto("resumo-descricao", parametros.get("descricao")?.trim() || "Não informada");

    const timestampBruto = parametros.get("timestamp");
    let dataFormatada = "Não informada";

    if (timestampBruto) {
      const dataObj = new Date(timestampBruto);
      if (!Number.isNaN(dataObj.getTime())) {
        dataFormatada = dataObj.toLocaleString("pt-BR", {
          dateStyle: "long",
          timeStyle: "short"
        });
      }
    }

    definirTexto("resumo-timestamp", dataFormatada);
  }
});