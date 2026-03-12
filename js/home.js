const BASE_URL = "http://localhost:8080/api/v1";

import { criarCardProduto } from './products.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Destaque: primeiros 6 produtos
  const produtos = await getAllProducts()

  iniciarCarrossel('trilho-produtos', produtos.content, 'carrossel-produtos');
});

/**
 * Monta o carrossel e seus controles
 * @param {string} trilhoId - ID do elemento trilho
 * @param {Array}  produtos  - array de produtos
 * @param {string} carrosselId - ID do wrapper do carrossel
 */
function iniciarCarrossel(trilhoId, produtos, carrosselId) {
  const trilho    = document.getElementById(trilhoId);
  const carrossel = document.getElementById(carrosselId);
  if (!trilho || !carrossel) return;

  // Renderiza os cards
  produtos.forEach(p => {
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
    const card = criarCardProduto(produtoFormatado);
    card.style.width = 'var(--card-w, 200px)';
    trilho.appendChild(card);
  });

  // Descobre a largura dos cards
  const getCardW = () => {
    const card = trilho.querySelector('.produto-card');
    if (!card) return 200;
    return card.offsetWidth + parseInt(getComputedStyle(trilho).gap || '16');
  };

  // Quantos cards cabem visíveis
  const getVisiveis = () => {
    const wrap = trilho.parentElement;
    const cardW = getCardW();
    return Math.max(1, Math.floor(wrap.offsetWidth / cardW));
  };

  let posicao = 0;
  const total = produtos.length;

  const btnPrev = carrossel.querySelector('.carrossel__btn--prev');
  const btnNext = carrossel.querySelector('.carrossel__btn--next');

  function mover(delta) {
    const visiveis = getVisiveis();
    const max = Math.max(0, total - visiveis);
    posicao = Math.min(Math.max(posicao + delta, 0), max);
    const offset = posicao * getCardW();
    trilho.style.transform = `translateX(-${offset}px)`;
    if (btnPrev) btnPrev.disabled = posicao === 0;
    if (btnNext) btnNext.disabled = posicao >= max;
  }

  btnPrev?.addEventListener('click', () => mover(-1));
  btnNext?.addEventListener('click', () => mover(1));

  // Configura largura de cada card com CSS responsivo
  function configurarLargura() {
    const wrap = trilho.parentElement;
    const visiveis = getVisiveis();
    const gap = 16;
    const w = Math.floor((wrap.offsetWidth - gap * (visiveis - 1)) / visiveis);
    trilho.querySelectorAll('.produto-card').forEach(c => c.style.width = `${w}px`);
    mover(0); // recalcula offset
  }

  configurarLargura();
  window.addEventListener('resize', debounce(configurarLargura, 150));
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
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
