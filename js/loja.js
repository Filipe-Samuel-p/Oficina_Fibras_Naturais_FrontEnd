const BASE_URL = "http://localhost:8080/api/v1";

import { criarCardProduto } from "./products.js";

const POR_PAGINA = 8;
let paginaAtual = 1;

document.addEventListener("DOMContentLoaded", () => {
  // Inicia a primeira renderização
  renderizarPagina(paginaAtual);
});

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
  console.log(produtosReais)
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
