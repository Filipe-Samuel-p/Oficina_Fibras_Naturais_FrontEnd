const BASE_URL = "http://localhost:8080/api/v1";

import { criarCardProduto } from "./products.js";

const POR_PAGINA = 8;
let paginaAtual = 1;
let isAdmin = false;

/**
 * Utilitários de Auth (Replicados de auth.js/admin.js)
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function jwtDecode(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Verifica permissões de administrador/coordenador
  const token = getCookie("token");
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded && decoded.roles && (decoded.roles.includes("ROLE_ADMIN") || decoded.roles.includes("ROLE_COORDINATOR"))) {
      isAdmin = true;
      const adminActions = document.getElementById("admin-actions");
      if (adminActions) adminActions.style.display = "flex";
      configurarModalProduto();
    }
  }

  // 2. Inicia a primeira renderização dos produtos
  renderizarPagina(paginaAtual);
});

/**
 * Lógica do Modal de Adicionar/Editar Produto
 */
function configurarModalProduto() {
  const modalAddProduto = document.getElementById("modal-add-produto");
  const btnAddProduto = document.getElementById("btn-add-produto");
  const btnFecharModalProduto = document.getElementById("fechar-modal-produto");
  const formAddProduto = document.getElementById("form-add-produto");
  const modalTitulo = modalAddProduto?.querySelector(".auth-painel__titulo");
  const btnSubmit = document.getElementById("btn-submit-produto");

  let produtoIdEditando = null;

  if (!modalAddProduto || !formAddProduto) return;

  const abrirModalProduto = (produto = null) => {
    if (produto) {
      // Modo Edição
      produtoIdEditando = produto.id;
      if (modalTitulo) modalTitulo.textContent = "Editar Produto";
      if (btnSubmit) btnSubmit.textContent = "Salvar Alterações";

      document.getElementById("prod-nome").value = produto.nome;
      document.getElementById("prod-desc").value = produto.descricao;
      document.getElementById("prod-preco").value = produto.preco;
      document.getElementById("prod-estoque").value = produto.estoque;
      document.getElementById("prod-img").value = produto.imageUrl;
      document.getElementById("prod-ativo").checked = produto.active;
    } else {
      // Modo Adição
      produtoIdEditando = null;
      if (modalTitulo) modalTitulo.textContent = "Adicionar Novo Produto";
      if (btnSubmit) btnSubmit.textContent = "Cadastrar Produto";
      formAddProduto.reset();
    }

    modalAddProduto.classList.add("visivel");
    document.body.style.overflow = "hidden";
  };

  const fecharModalProduto = () => {
    modalAddProduto.classList.remove("visivel");
    document.body.style.overflow = "";
    formAddProduto.reset();
    produtoIdEditando = null;
  };

  if (btnAddProduto) btnAddProduto.addEventListener("click", () => abrirModalProduto());
  if (btnFecharModalProduto) btnFecharModalProduto.addEventListener("click", fecharModalProduto);

  // Escuta o evento de editar disparado pelo card
  window.addEventListener('produto:editar', (e) => {
    abrirModalProduto(e.detail);
  });

  // Fechar ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modalAddProduto) fecharModalProduto();
  });

  // Envio do formulário
  formAddProduto.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    const produtoData = {
      name: document.getElementById("prod-nome").value,
      description: document.getElementById("prod-desc").value,
      pricePerUnit: parseFloat(document.getElementById("prod-preco").value),
      stockQuantity: parseInt(document.getElementById("prod-estoque").value),
      imageUrl: document.getElementById("prod-img").value,
      active: document.getElementById("prod-ativo").checked
    };

    try {
      btnSubmit.disabled = true;
      const originalText = btnSubmit.textContent;
      btnSubmit.textContent = produtoIdEditando ? "Salvando..." : "Cadastrando...";

      const url = produtoIdEditando ? `${BASE_URL}/product/${produtoIdEditando}` : `${BASE_URL}/product`;
      const method = produtoIdEditando ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produtoData),
      });

      if (!res.ok) throw new Error(`Erro ao ${produtoIdEditando ? "editar" : "cadastrar"} produto`);

      alert(`Produto ${produtoIdEditando ? "atualizado" : "cadastrado"} com sucesso!`);
      fecharModalProduto();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Erro ao processar produto. Tente novamente.`);
    } finally {
      btnSubmit.disabled = false;
    }
  });
}

async function renderizarPagina(pagina) {
  const grid = document.getElementById("loja-grid");
  const paginacao = document.getElementById("paginacao");
  const btnPrev = document.getElementById("pag-prev");
  const btnNext = document.getElementById("pag-next");

  if (!grid) return;

  // 1. Busca os produtos reais da API (Página da API é 0-based)
  const data = await getAllProducts(pagina - 1, POR_PAGINA);

  if (!data || !data.content) {
    grid.innerHTML =
      '<p class="error">Não foi possível carregar os produtos.</p>';
    return;
  }

  const produtosReais = data.content;
  const totalPags = data.totalPages;

  // 2. Limpa e preenche o grid com os dados da API
  grid.innerHTML = "";
  produtosReais.forEach((p) => {
    // Mapeamos os campos da API para o formato esperado pelo criarCardProduto
    // API: name, pricePerUnit, imageUrl -> Componente: nome, preco, imagem
    const produtoFormatado = {
      id: p.id,
      nome: p.name,
      preco: p.pricePerUnit,
      imagem: p.imageUrl,
      descricao: p.description,
      estoque: p.stockQuantity,
      active: p.active,
      imageUrl: p.imageUrl,
      emoji: '🛒',
    };

    const card = criarCardProduto(produtoFormatado, {
      mostrarCartLink: "carrinho.html",
      isAdmin: isAdmin
    });
    grid.appendChild(card);
  });

  // 3. Lógica de Paginação Dinâmica
  if (paginacao) {
    // Limpa botões numéricos antigos
    paginacao.querySelectorAll(".paginacao__num").forEach((b) => b.remove());

    // Gera os botões de página baseados no totalPages da API
    for (let i = 1; i <= totalPags; i++) {
      const btn = document.createElement("button");
      btn.className = `paginacao__btn paginacao__num${i === pagina ? " ativo" : ""}`;
      btn.textContent = i;
      btn.setAttribute("aria-label", `Página ${i}`);
      if (i === pagina) btn.setAttribute("aria-current", "page");

      btn.addEventListener("click", async () => {
        paginaAtual = i;
        await renderizarPagina(i);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      paginacao.insertBefore(btn, btnNext);
    }

    // Configura botões Anterior/Próximo
    if (btnPrev) {
      btnPrev.disabled = pagina === 1;
      btnPrev.onclick = async () => {
        if (paginaAtual > 1) {
          paginaAtual--;
          await renderizarPagina(paginaAtual);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };
    }
    if (btnNext) {
      btnNext.disabled = pagina === totalPags;
      btnNext.onclick = async () => {
        if (paginaAtual < totalPags) {
          paginaAtual++;
          await renderizarPagina(paginaAtual);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };
    }
  }
}

const getAllProducts = async (page = 0, size = 8) => {
  try {
    const res = await fetch(`${BASE_URL}/product?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Erro ao carregar produtos");

    const data = await res.json();
    return data; // Retorna o objeto completo com content, totalPages, etc.
  } catch (error) {
    console.error("Erro na busca de produtos:", error);
    return null;
  }
};
