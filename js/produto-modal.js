// =============================================
// OFICINA DE FIBRAS NATURAIS — produto-modal.js
// Modal de detalhes do produto
// =============================================

import { Cart, formatarBRL } from './cart.js';

// ============================
// Inicialização
// ============================
document.addEventListener('DOMContentLoaded', () => {
  injetarHTMLModal();
  vincularEventos();

  // Escuta o evento disparado pelo clique no card
  window.addEventListener('produto:abrir', (e) => {
    abrirModal(e.detail);
  });
});

// ============================
// Injeta o HTML do modal no <body>
// ============================
function injetarHTMLModal() {
  if (document.getElementById('modal-produto')) return;

  const html = `
  <div id="modal-produto" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="produto-modal-nome">
    <div class="modal">
      <button class="modal__fechar" id="modal-produto-fechar" aria-label="Fechar">✕</button>

      <div class="produto-modal__grid">

        <!-- Imagem -->
        <div class="produto-modal__img-wrap" id="pm-img-wrap">
          <span class="produto-modal__emoji" id="pm-emoji" aria-hidden="true"></span>
          <img class="produto-modal__img" id="pm-img" alt="" style="display:none;"/>
          <span class="produto-modal__badge-off"  id="pm-badge-off"   style="display:none;"></span>
          <span class="produto-modal__badge-inativo" id="pm-badge-inativo" style="display:none;">Inativo</span>
        </div>

        <!-- Detalhes -->
        <div class="produto-modal__corpo">

          <!-- Status ativo/inativo -->
          <span class="produto-modal__status" id="pm-status">
            <span class="produto-modal__status-dot"></span>
            <span id="pm-status-txt"></span>
          </span>

          <h2 class="produto-modal__nome" id="produto-modal-nome"></h2>

          <p class="produto-modal__desc" id="pm-desc"></p>

          <div class="produto-modal__divider"></div>

          <!-- Preço -->
          <div class="produto-modal__precos">
            <span class="produto-modal__preco" id="pm-preco"></span>
            <span class="produto-modal__preco-antigo" id="pm-preco-antigo" style="display:none;"></span>
          </div>

          <!-- Estoque -->
          <div class="produto-modal__estoque">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
            </svg>
            <span>Estoque:</span>
            <strong class="produto-modal__estoque-num" id="pm-estoque-num"></strong>
            <div class="produto-modal__estoque-bar" aria-hidden="true">
              <div class="produto-modal__estoque-fill" id="pm-estoque-fill"></div>
            </div>
          </div>

          <!-- Ações -->
          <div class="produto-modal__acoes" id="pm-acoes">
            <div class="produto-modal__qtd" role="group" aria-label="Quantidade">
              <button class="produto-modal__qtd-btn" id="pm-qtd-menos" aria-label="Diminuir quantidade">−</button>
              <input class="produto-modal__qtd-num" id="pm-qtd" type="number" value="1" min="1" aria-label="Quantidade"/>
              <button class="produto-modal__qtd-btn" id="pm-qtd-mais" aria-label="Aumentar quantidade">+</button>
            </div>
            <button class="produto-modal__btn-add" id="pm-btn-add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.52L23 6H6"/>
              </svg>
              Adicionar ao Carrinho
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

// ============================
// Eventos do modal
// ============================
function vincularEventos() {
  document.addEventListener('click', (e) => {
    // Fechar pelo botão X
    if (e.target.closest('#modal-produto-fechar')) fecharModal();
    // Fechar clicando no backdrop
    if (e.target.id === 'modal-produto') fecharModal();
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });
}

// ============================
// Abrir modal com dados do produto
// ============================
let produtoAtual = null;

function abrirModal(produto) {
  produtoAtual = produto;

  const modal        = document.getElementById('modal-produto');
  const pmNome       = document.getElementById('produto-modal-nome');
  const pmDesc       = document.getElementById('pm-desc');
  const pmPreco      = document.getElementById('pm-preco');
  const pmPrecoAnt   = document.getElementById('pm-preco-antigo');
  const pmBadgeOff   = document.getElementById('pm-badge-off');
  const pmBadgeIn    = document.getElementById('pm-badge-inativo');
  const pmEmoji      = document.getElementById('pm-emoji');
  const pmImg        = document.getElementById('pm-img');
  const pmEstNum     = document.getElementById('pm-estoque-num');
  const pmEstFill    = document.getElementById('pm-estoque-fill');
  const pmStatus     = document.getElementById('pm-status');
  const pmStatusTxt  = document.getElementById('pm-status-txt');
  const pmQtd        = document.getElementById('pm-qtd');
  const pmBtnAdd     = document.getElementById('pm-btn-add');

  if (!modal) return;

  // Nome e descrição
  pmNome.textContent = produto.nome;
  pmDesc.textContent = produto.description;

  // Imagem
  if (produto.imageUrl) {
    pmImg.src = produto.imageUrl;
    pmImg.alt = produto.nome;
    pmImg.style.display = 'block';
    pmEmoji.style.display = 'none';
  } else {
    pmEmoji.textContent = produto.emoji || '📦';
    pmEmoji.style.display = 'block';
    pmImg.style.display = 'none';
  }

  // Preço
  pmPreco.textContent = formatarBRL(produto.pricePerUnit);
  if (produto.precoAntigo) {
    pmPrecoAnt.textContent = formatarBRL(produto.precoAntigo);
    pmPrecoAnt.style.display = 'inline';
    pmBadgeOff.textContent  = `${produto.desconto}% OFF`;
    pmBadgeOff.style.display = 'inline';
  } else {
    pmPrecoAnt.style.display = 'none';
    pmBadgeOff.style.display = 'none';
  }

  // Status active
  const isAtivo = produto.active;
  pmStatus.className = `produto-modal__status produto-modal__status--${isAtivo ? 'ativo' : 'inativo'}`;
  pmStatusTxt.textContent = isAtivo ? 'Produto ativo' : 'Produto inativo';
  pmBadgeIn.style.display = isAtivo ? 'none' : 'inline';

  // Estoque
  const estoqueMax = 30; // referência para a barra
  const pct = Math.min((produto.stockQuantity / estoqueMax) * 100, 100);
  pmEstNum.textContent = produto.stockQuantity > 0
    ? `${produto.stockQuantity} unidades`
    : 'Esgotado';
  pmEstFill.style.width = `${pct}%`;
  pmEstFill.style.background = produto.stockQuantity > 5
    ? 'var(--verde-botao)'
    : produto.stockQuantity > 0 ? 'var(--amarelo-badge)' : '#C0392B';

  // Botão e quantidade
  const semEstoque = produto.stockQuantity === 0 || !produto.active;
  pmBtnAdd.disabled = semEstoque;
  pmBtnAdd.textContent = semEstoque ? 'Indisponível' : 'Adicionar ao Carrinho';
  if (!semEstoque) {
    pmBtnAdd.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.52L23 6H6"/>
      </svg>
      Adicionar ao Carrinho`;
  }
  pmQtd.value = 1;
  pmQtd.max   = produto.stockQuantity;

  // Controles de quantidade
  const menos = document.getElementById('pm-qtd-menos');
  const mais  = document.getElementById('pm-qtd-mais');

  // Remove listeners antigos clonando
  const menosClone = menos.cloneNode(true);
  const maisClone  = mais.cloneNode(true);
  menos.replaceWith(menosClone);
  mais.replaceWith(maisClone);
  const addClone = pmBtnAdd.cloneNode(true);
  pmBtnAdd.replaceWith(addClone);

  menosClone.addEventListener('click', () => {
    const v = parseInt(document.getElementById('pm-qtd').value, 10);
    if (v > 1) document.getElementById('pm-qtd').value = v - 1;
  });

  maisClone.addEventListener('click', () => {
    const v   = parseInt(document.getElementById('pm-qtd').value, 10);
    const max = parseInt(document.getElementById('pm-qtd').max, 10) || 99;
    if (v < max) document.getElementById('pm-qtd').value = v + 1;
  });

  addClone.addEventListener('click', () => {
    if (addClone.disabled) return;
    const qtd = parseInt(document.getElementById('pm-qtd').value, 10) || 1;
    Cart.adicionar({ ...produto, preco: produto.pricePerUnit, quantidade: qtd });

    addClone.innerHTML = '✓ Adicionado!';
    addClone.style.background = 'var(--verde-escuro)';
    setTimeout(() => {
      addClone.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.52L23 6H6"/>
        </svg>
        Adicionar ao Carrinho`;
      addClone.style.background = '';
    }, 1600);
  });

  // Exibe o modal
  modal.classList.add('visivel');
  document.body.classList.add('sem-scroll');

  // Foca no botão fechar para acessibilidade
  setTimeout(() => document.getElementById('modal-produto-fechar')?.focus(), 50);
}

// ============================
// Fechar modal
// ============================
function fecharModal() {
  const modal = document.getElementById('modal-produto');
  if (!modal) return;
  modal.classList.remove('visivel');
  document.body.classList.remove('sem-scroll');
}
