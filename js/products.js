export function criarCardProduto(produto) {
  const card = document.createElement('article');
  card.className = 'produto-card';
  card.setAttribute('aria-label', produto.nome);
  card.style.cursor = 'pointer';
  const temDesconto = produto.desconto && produto.precoAntigo;
  const semEstoque  = produto.stockQuantity === 0 || !produto.active;

  card.innerHTML = `
    ${temDesconto && produto.active ? `<span class="produto-card__badge">${produto.desconto}% OFF</span>` : ''}
    ${!produto.active ? `<span class="produto-card__badge" style="background:#C0392B;">Inativo</span>` : ''}
    ${produto.active && produto.stockQuantity === 0 ? `<span class="produto-card__badge" style="background:#888;">Esgotado</span>` : ''}

    <div class="produto-card__img" aria-hidden="true" style="font-size:48px;line-height:1;padding:20px 0;cursor:pointer;">
      ${produto.imageUrl
        ? `<img src="${produto.imageUrl}" alt="${produto.nome}" style="width:100%;height:100%;object-fit:cover;"/>`
        : produto.emoji}
    </div>

    <div class="produto-card__corpo">
      <p class="produto-card__nome">${produto.nome}</p>
      <div class="produto-card__precos">
        <span class="produto-card__preco-atual">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
        ${temDesconto
          ? `<span class="produto-card__preco-antigo">R$ ${produto.precoAntigo.toFixed(2).replace('.', ',')}</span>
             <span class="produto-card__preco-off">${produto.desconto}% off</span>`
          : ''}
      </div>
      <button
        class="produto-card__btn"
        data-id="${produto.id}"
        aria-label="Adicionar ${produto.nome} ao carrinho"
        ${semEstoque ? 'disabled style="background:var(--cinza-borda);cursor:not-allowed;"' : ''}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.52L23 6H6"/>
        </svg>
        ${semEstoque ? 'Indisponível' : 'Adicionar ao Carrinho'}
      </button>
    </div>
  `;

  // Clique na imagem ou nome → abre modal de detalhe
  const abrirDetalhe = (e) => {
    if (e.target.closest('.produto-card__btn')) return; // deixa o botão funcionar normalmente
    window.dispatchEvent(new CustomEvent('produto:abrir', { detail: produto }));
  };

  card.addEventListener('click', abrirDetalhe);

  return card;
}
