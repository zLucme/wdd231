document.addEventListener("DOMContentLoaded", () => {
  const anoSpan = document.getElementById("ano-copyright");
  const modificacaoSpan = document.getElementById("ultima-modificacao");

  if (anoSpan) anoSpan.textContent = String(new Date().getFullYear());
  if (modificacaoSpan) modificacaoSpan.textContent = document.lastModified;

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
      if (elemento) elemento.textContent = valorPadrao;
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

  let interatividadeIniciada = false;

  function iniciarInteratividade() {
    if (interatividadeIniciada) return;
    interatividadeIniciada = true;

    const btnHamburguer = document.getElementById("btn-hamburguer");
    const listaMenu = document.getElementById("lista-menu");
    const campoTimestamp = document.getElementById("timestamp");
    const formulario = document.getElementById("form-associacao");

    function atualizarTimestamp() {
      if (campoTimestamp) {
        campoTimestamp.value = new Date().toISOString();
      }
    }

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
        if (campo.id === "cargo") {
          campo.setAttribute("aria-describedby", "dica-cargo erro-cargo");
        }
      } else {
        campo.removeAttribute("aria-invalid");
        spanErro.textContent = "";
        if (campo.id === "cargo") {
          campo.setAttribute("aria-describedby", "dica-cargo");
        }
      }

      return valido;
    }

    if (formulario) {
      atualizarTimestamp();

      formulario.addEventListener("focusout", (evento) => {
        const campo = evento.target;
        if (campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement) {
          if (campo.type !== "hidden") validarCampo(campo);
        }
      });

      formulario.addEventListener("input", (evento) => {
        const campo = evento.target;
        if (
          (campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement) &&
          campo.getAttribute("aria-invalid") === "true"
        ) {
          validarCampo(campo);
        }
      });

      formulario.addEventListener("submit", (evento) => {
        atualizarTimestamp();
        let primeiroInvalido = null;
        const camposValidaveis = formulario.querySelectorAll("input:not([type='hidden']), select");

        camposValidaveis.forEach((campo) => {
          if (!validarCampo(campo) && !primeiroInvalido) {
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
    const cartoesNivel = trilhoNiveis ? trilhoNiveis.querySelectorAll(".cartao-nivel") : [];
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
        if (botaoCard) botaoCard.tabIndex = ativo ? 0 : -1;
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
    }

    let ultimoBotaoModal = null;

    document.addEventListener("click", (evento) => {
      const alvo = evento.target;
      if (!(alvo instanceof Element)) return;

      if (alvo.id === "btn-hamburguer" && btnHamburguer && listaMenu) {
        const aberto = listaMenu.classList.toggle("aberto");
        btnHamburguer.setAttribute("aria-expanded", String(aberto));
        return;
      }

      if (alvo.id === "modo-escuro") {
        document.body.classList.toggle("dark-mode");
        return;
      }

      if (alvo.id === "btn-nivel-anterior") {
        atualizarCarrossel(indiceAtual - 1);
        return;
      }

      if (alvo.id === "btn-nivel-proximo") {
        atualizarCarrossel(indiceAtual + 1);
        return;
      }

      const indicador = alvo.closest(".indicador-carrossel");
      if (indicador) {
        const indice = Number(indicador.getAttribute("data-indice"));
        if (!Number.isNaN(indice)) atualizarCarrossel(indice);
        return;
      }

      const botaoModal = alvo.closest("[data-modal]");
      if (botaoModal) {
        const idModal = botaoModal.getAttribute("data-modal");
        const modal = idModal ? document.getElementById(idModal) : null;
        if (modal && typeof modal.showModal === "function") {
          ultimoBotaoModal = botaoModal;
          modal.showModal();
        }
        return;
      }

      if (alvo.closest("[data-fechar-modal]")) {
        const modal = alvo.closest("dialog.modal-nivel");
        if (modal) modal.close();
        return;
      }

      if (alvo.matches("dialog.modal-nivel[open]")) {
        const rect = alvo.getBoundingClientRect();
        const fora =
          evento.clientX < rect.left ||
          evento.clientX > rect.right ||
          evento.clientY < rect.top ||
          evento.clientY > rect.bottom;
        if (fora) alvo.close();
      }
    });

    document.querySelectorAll("dialog.modal-nivel").forEach((modal) => {
      modal.addEventListener("close", () => {
        if (ultimoBotaoModal && typeof ultimoBotaoModal.focus === "function") {
          ultimoBotaoModal.focus();
          ultimoBotaoModal = null;
        }
      });
    });

    if (trilhoNiveis && cartoesNivel.length > 0) {
      document.addEventListener("keydown", (evento) => {
        if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;
        if (document.querySelector("dialog.modal-nivel[open]")) return;

        const tagFocada = document.activeElement ? document.activeElement.tagName : "";
        if (tagFocada === "INPUT" || tagFocada === "TEXTAREA" || tagFocada === "SELECT") return;

        evento.preventDefault();
        atualizarCarrossel(evento.key === "ArrowLeft" ? indiceAtual - 1 : indiceAtual + 1);
      });
    }
  }

  const dispararPorInteracao = () => {
    window.removeEventListener("pointerdown", dispararPorInteracao);
    window.removeEventListener("keydown", dispararPorInteracao);
    iniciarInteratividade();
  };

  window.addEventListener("pointerdown", dispararPorInteracao, { once: true, passive: true });
  window.addEventListener("keydown", dispararPorInteracao, { once: true, passive: true });

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => iniciarInteratividade(), { timeout: 1500 });
  } else {
    window.setTimeout(iniciarInteratividade, 800);
  }
});