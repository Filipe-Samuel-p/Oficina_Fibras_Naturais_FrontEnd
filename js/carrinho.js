// =============================================
// OFICINA DE FIBRAS NATURAIS — carrinho.js
// Página do carrinho: listar, alterar qtd, remover
// =============================================

import { Cart, formatarBRL } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();

  window.addEventListener('carrinho:atualizado', renderizarCarrinho);

  // WhatsApp
  document.getElementById('btn-whatsapp')?.addEventListener('click', abrirWhatsApp);
});

// ============================
// Renderização
// ============================
function renderizarCarrinho() {
  const container = document.getElementById('carrinho-itens');
  const resumoLinhas = document.getElementById('resumo-linhas');
  const totalEl = document.getElementById('resumo-total');
  if (!container) return;

  const itens = Cart.getItens();
  container.innerHTML = '';

  if (itens.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 0;color:var(--cinza-texto);">
        <div style="font-size:48px;margin-bottom:16px;">🛒</div>
        <p style="font-size:16px;font-weight:600;">Seu carrinho está vazio</p>
        <a href="loja.html" style="display:inline-block;margin-top:16px;color:var(--verde-botao);font-weight:600;">
          Ver produtos →
        </a>
      </div>`;
    if (resumoLinhas) resumoLinhas.innerHTML = '';
    if (totalEl) totalEl.textContent = 'R$ 0,00';
    return;
  }

  itens.forEach(item => {
    const el = document.createElement('div');
    el.className = 'carrinho-item';
    el.dataset.id = item.id;
    el.innerHTML = `
      <div class="carrinho-item__img" aria-hidden="true">${item.emoji || '📦'}</div>
      <div class="carrinho-item__info">
        <p class="carrinho-item__nome">${item.nome}</p>
        <p class="carrinho-item__preco">${formatarBRL(item.preco)}</p>
        <div class="carrinho-item__qtd" aria-label="Quantidade de ${item.nome}">
          <button class="carrinho-item__qtd-btn" data-acao="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span class="carrinho-item__qtd-num">${item.quantidade}</span>
          <button class="carrinho-item__qtd-btn" data-acao="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="carrinho-item__remover" data-id="${item.id}" aria-label="Remover ${item.nome}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    `;
    container.appendChild(el);
  });

  // Resumo
  if (resumoLinhas) {
    resumoLinhas.innerHTML = itens.map(i => `
      <div class="carrinho-resumo__linha">
        <span>${i.nome} × ${i.quantidade}</span>
        <span>${formatarBRL(i.preco * i.quantidade)}</span>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = formatarBRL(Cart.getTotalValor());

  // Listeners
  container.querySelectorAll('[data-acao]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = parseInt(btn.dataset.id, 10);
      const acao = btn.dataset.acao;
      const item = Cart.getItens().find(i => i.id === id);
      if (!item) return;
      if (acao === 'aumentar') Cart.setQuantidade(id, item.quantidade + 1);
      if (acao === 'diminuir') Cart.setQuantidade(id, item.quantidade - 1);
    });
  });

  container.querySelectorAll('.carrinho-item__remover').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.remover(parseInt(btn.dataset.id, 10));
    });
  });
}

// ============================
// WhatsApp
// ============================
function abrirWhatsApp() {
  const itens = Cart.getItens();
  if (!itens.length) return;

  const linhas = itens.map(i => `• ${i.nome} (${i.quantidade}x) – ${formatarBRL(i.preco * i.quantidade)}`);
  const total  = formatarBRL(Cart.getTotalValor());
  const texto  = `Olá! Gostaria de fazer um pedido:\n\n${linhas.join('\n')}\n\n*Total: ${total}*`;

  // Substitua pelo número real: 5522999999999
  const numero = '5522999999999';
  const url    = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}
