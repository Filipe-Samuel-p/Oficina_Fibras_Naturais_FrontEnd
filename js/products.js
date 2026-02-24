// =============================================
// OFICINA DE FIBRAS NATURAIS — products.js
// Dados mock dos produtos (atualizado)
// Inclui: name, description, pricePerUnit,
//         stockQuantity, imageUrl, active
// =============================================

export const PRODUTOS = [
  {
    id: 1,
    nome: 'Suporte de Boneca Palha',
    description: 'Suporte artesanal confeccionado com fibras naturais de palha trançada à mão. Perfeito para decoração de ambientes rústicos e naturais. Cada peça é única.',
    pricePerUnit: 85.00,
    precoAntigo: null,
    desconto: null,
    stockQuantity: 14,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 2,
    nome: 'Suporte de Boneca Cipó',
    description: 'Suporte de boneca produzido com cipó seco e tiras de bambu, técnica tradicional da Mata Atlântica. Produto sustentável com acabamento natural.',
    pricePerUnit: 85.00,
    precoAntigo: 151.79,
    desconto: 44,
    stockQuantity: 7,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 3,
    nome: 'Suporte de Boneca Sisal',
    description: 'Escultura decorativa em sisal natural, colorido com tinturas vegetais. Ótima opção de presente artesanal ou item de decoração autêntico.',
    pricePerUnit: 85.00,
    precoAntigo: 151.79,
    desconto: 44,
    stockQuantity: 3,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 4,
    nome: 'Suporte de Boneca Juta',
    description: 'Boneca decorativa em juta crua, com enchimento de algodão orgânico e acabamento costurado à mão. Hipoalergênica e ecológica.',
    pricePerUnit: 85.00,
    precoAntigo: 151.79,
    desconto: 44,
    stockQuantity: 0,
    imageUrl: null,
    emoji: '🪆',
    active: false,
    categoria: 'decoracao',
  },
  {
    id: 5,
    nome: 'Suporte de Boneca Buriti',
    description: 'Produto artesanal confeccionado com fibras de buriti, extraídas de forma sustentável no cerrado brasileiro. Peça certificada pelo programa de artesanato sustentável.',
    pricePerUnit: 85.00,
    precoAntigo: 151.79,
    desconto: 44,
    stockQuantity: 11,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 6,
    nome: 'Suporte de Boneca Taboa',
    description: 'Suporte produzido com folhas de taboa (Typha domingensis), planta aquática que cresce em rios e lagos. Levíssima, resistente e com textura única.',
    pricePerUnit: 85.00,
    precoAntigo: null,
    desconto: null,
    stockQuantity: 5,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 7,
    nome: 'Fatia de Laranja Desidratada',
    description: 'Decoração artesanal com fatias de laranja lentamente desidratadas ao sol. Exala aroma cítrico suave e é perfeita para arranjos natalinos, coroas e guirlandas.',
    pricePerUnit: 60.00,
    precoAntigo: 107.14,
    desconto: 44,
    stockQuantity: 22,
    imageUrl: null,
    emoji: '🍊',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 8,
    nome: 'Fatia de Laranja com Cravo',
    description: 'Fatia de laranja desidratada com cravos-da-índia incrustados. Dupla função: decoração natural e aromatizador de ambientes. Aroma de especiarias por até 6 meses.',
    pricePerUnit: 60.00,
    precoAntigo: 107.14,
    desconto: 44,
    stockQuantity: 18,
    imageUrl: null,
    emoji: '🍊',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 9,
    nome: 'Fatia de Laranja em Resina',
    description: 'Fatia de laranja preservada em resina ecológica biodegradável, montada em base de madeira maciça. Peça decorativa permanente, não apodrece nem resseca.',
    pricePerUnit: 60.00,
    precoAntigo: 107.14,
    desconto: 44,
    stockQuantity: 9,
    imageUrl: null,
    emoji: '🍊',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 10,
    nome: 'Guirlanda Cítrica Natural',
    description: 'Guirlanda com fatias de laranja, limão e tangerina desidratadas, combinadas com folhas secas e fita de juta. Ideal para decoração de portas e janelas.',
    pricePerUnit: 60.00,
    precoAntigo: 107.14,
    desconto: 44,
    stockQuantity: 0,
    imageUrl: null,
    emoji: '🍊',
    active: false,
    categoria: 'decoracao',
  },
  {
    id: 11,
    nome: 'Suporte de Boneca Mimosa',
    description: 'Edição limitada com fibras de mimosa tingidas em corante natural de açafrão-da-terra. Visual quente e textura aveludada. Apenas 20 unidades produzidas.',
    pricePerUnit: 85.00,
    precoAntigo: null,
    desconto: null,
    stockQuantity: 2,
    imageUrl: null,
    emoji: '🪆',
    active: true,
    categoria: 'decoracao',
  },
  {
    id: 12,
    nome: 'Mix Cítrico Decorativo',
    description: 'Kit com 6 fatias sortidas de frutas cítricas desidratadas: laranja, limão-siciliano e bergamota. Embalagem presenteável em caixa kraft com laço de sisal.',
    pricePerUnit: 60.00,
    precoAntigo: 107.14,
    desconto: 44,
    stockQuantity: 30,
    imageUrl: null,
    emoji: '🍊',
    active: true,
    categoria: 'decoracao',
  },
];

// ============================
// Renderiza card de produto
// ============================
/**
 * Cria um <article> de produto pronto para o DOM.
 * Ao clicar, dispara o evento global 'produto:abrir' com os dados.
 */
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
        <span class="produto-card__preco-atual">R$ ${produto.pricePerUnit.toFixed(2).replace('.', ',')}</span>
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
