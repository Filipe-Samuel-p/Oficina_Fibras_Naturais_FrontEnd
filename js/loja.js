// =============================================
// OFICINA DE FIBRAS NATURAIS — loja.js
// Grid de produtos com paginação
// =============================================

import { PRODUTOS, criarCardProduto } from './products.js';

const POR_PAGINA = 8;
let paginaAtual = 1;

document.addEventListener('DOMContentLoaded', () => {
  renderizarPagina(paginaAtual);
});

function renderizarPagina(pagina) {
  const grid      = document.getElementById('loja-grid');
  const paginacao = document.getElementById('paginacao');
  const btnPrev   = document.getElementById('pag-prev');
  const btnNext   = document.getElementById('pag-next');
  if (!grid) return;

  // Calcula slice
  const inicio = (pagina - 1) * POR_PAGINA;
  const fim    = inicio + POR_PAGINA;
  const pagProdutos = PRODUTOS.slice(inicio, fim);
  const totalPags   = Math.ceil(PRODUTOS.length / POR_PAGINA);

  // Limpa e preenche o grid
  grid.innerHTML = '';
  pagProdutos.forEach(p => {
    const card = criarCardProduto(p, { mostrarCartLink: 'carrinho.html' });
    grid.appendChild(card);
  });

  // Paginação
  if (paginacao && totalPags > 1) {
    // Remove botões de número antigos
    paginacao.querySelectorAll('.paginacao__num').forEach(b => b.remove());

    // Insere botões de número antes do botão "next"
    for (let i = 1; i <= totalPags; i++) {
      const btn = document.createElement('button');
      btn.className = `paginacao__btn paginacao__num${i === pagina ? ' ativo' : ''}`;
      btn.textContent = i;
      btn.setAttribute('aria-label', `Página ${i}`);
      if (i === pagina) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', () => {
        paginaAtual = i;
        renderizarPagina(i);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginacao.insertBefore(btn, btnNext);
    }

    if (btnPrev) {
      btnPrev.disabled = pagina === 1;
      btnPrev.onclick = () => {
        if (paginaAtual > 1) { paginaAtual--; renderizarPagina(paginaAtual); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      };
    }
    if (btnNext) {
      btnNext.disabled = pagina === totalPags;
      btnNext.onclick = () => {
        if (paginaAtual < totalPags) { paginaAtual++; renderizarPagina(paginaAtual); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      };
    }
  }
}
