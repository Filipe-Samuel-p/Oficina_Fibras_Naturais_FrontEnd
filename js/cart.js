// =============================================
// OFICINA DE FIBRAS NATURAIS — cart.js
// Estado global do carrinho (localStorage)
// =============================================

const CHAVE = 'ofn_carrinho';

export const Cart = {

  /** Retorna todos os itens */
  getItens() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || [];
    } catch {
      return [];
    }
  },

  /** Salva os itens */
  _salvar(itens) {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
    window.dispatchEvent(new CustomEvent('carrinho:atualizado', { detail: itens }));
  },

  /** Adiciona ou incrementa item */
  adicionar(produto) {
    const itens = this.getItens();
    const idx = itens.findIndex(i => i.id === produto.id);
    if (idx >= 0) {
      itens[idx].quantidade += produto.quantidade || 1;
    } else {
      itens.push({ ...produto, quantidade: produto.quantidade || 1 });
    }
    this._salvar(itens);
  },

  /** Remove item pelo id */
  remover(id) {
    const itens = this.getItens().filter(i => i.id !== id);
    this._salvar(itens);
  },

  /** Altera quantidade */
  setQuantidade(id, qtd) {
    const itens = this.getItens();
    const idx = itens.findIndex(i => i.id === id);
    if (idx >= 0) {
      if (qtd <= 0) {
        itens.splice(idx, 1);
      } else {
        itens[idx].quantidade = qtd;
      }
    }
    this._salvar(itens);
  },

  /** Total de unidades */
  getTotalUnidades() {
    return this.getItens().reduce((acc, i) => acc + i.quantidade, 0);
  },

  /** Valor total */
  getTotalValor() {
    return this.getItens().reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
  },

  /** Limpa o carrinho */
  limpar() {
    this._salvar([]);
  },
};

/** Formata número como moeda BRL */
export function formatarBRL(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
