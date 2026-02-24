# Oficina de Fibras Naturais — Frontend

Site de e-commerce em HTML, CSS e JavaScript puro (sem frameworks), baseado no design Figma.

---

## 📁 Estrutura de Pastas

```
oficina-fibras-naturais/
│
├── index.html                  ← Página inicial (Home)
│
├── pages/
│   ├── loja.html               ← Grade de produtos com paginação
│   ├── faq.html                ← Perguntas frequentes (accordion)
│   ├── suporte.html            ← Formulário de contato
│   ├── carrinho.html           ← Carrinho + resumo + WhatsApp
│   └── _header.html            ← Fragmento de referência (header + sidebar)
│
├── css/
│   ├── variables.css           ← Design tokens (cores, fontes, espaçamento)
│   ├── reset.css               ← Normalize / reset
│   ├── components.css          ← Todos os componentes reutilizáveis
│   └── pages.css               ← Estilos específicos por página
│
├── js/
│   ├── main.js                 ← Bootstrap global: sidebar, badge do carrinho
│   ├── cart.js                 ← Estado do carrinho via localStorage
│   ├── products.js             ← Dados mock + função criarCardProduto()
│   ├── home.js                 ← Carrosséis da homepage
│   ├── loja.js                 ← Grid com paginação
│   ├── faq.js                  ← Accordion de FAQ
│   ├── suporte.js              ← Validação e envio do formulário de contato
│   └── carrinho.js             ← Renderização e interações do carrinho
│
└── assets/
    └── images/                 ← Imagens dos produtos (substituir placeholders)
```

---

## 🎨 Design System

### Cores principais
| Token             | Valor     | Uso                         |
|-------------------|-----------|-----------------------------|
| `--verde-banner`  | `#5C8A28` | Banner hero, sidebar ativo  |
| `--verde-botao`   | `#5A8C2A` | Botões CTA                  |
| `--verde-hover`   | `#497320` | Hover dos botões            |
| `--marrom-medio`  | `#5C3D1E` | Footer                      |
| `--amarelo-badge` | `#E8A020` | Badge "X% OFF"              |

### Tipografia
- **Títulos**: Montserrat (700–800)
- **Corpo**: Open Sans (400–600)

---

## 📄 Páginas

| Página           | Arquivo              | Funcionalidades                                       |
|------------------|----------------------|-------------------------------------------------------|
| Home             | `index.html`         | Banner hero, carrosseis destaque/recentes, mapa       |
| Loja             | `pages/loja.html`    | Grid 4 col, paginação                                 |
| FAQ              | `pages/faq.html`     | Accordion com animação                                |
| Suporte          | `pages/suporte.html` | Form validado (nome, email, tel, assunto, mensagem)   |
| Carrinho         | `pages/carrinho.html`| Qtd +/−, remover, resumo, botão WhatsApp              |

---

## ⚙️ Módulos JS

### `cart.js`
- `Cart.adicionar(produto)` — adiciona ou incrementa
- `Cart.remover(id)` — remove item
- `Cart.setQuantidade(id, qtd)` — altera quantidade
- `Cart.getTotalUnidades()` — total de itens (para badge)
- `Cart.getTotalValor()` — valor total em R$
- Evento `carrinho:atualizado` disparado em cada mudança

### `products.js`
- Array `PRODUTOS` com todos os produtos mock
- `criarCardProduto(produto)` → retorna `<article>` pronto

---

## 🚀 Como rodar

> **Não requer build.** Basta servir os arquivos estaticamente.

```bash
# Com Python
python3 -m http.server 3000

# Com Node (npx)
npx serve .

# Com VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

Acesse: `http://localhost:3000`

---

## 🔧 Para adaptar ao backend

1. **Produtos reais**: Substitua o array em `js/products.js` por chamadas `fetch()` à sua API
2. **Imagens**: Coloque em `assets/images/` e aponte `produto.img` no array de produtos
3. **WhatsApp**: Em `js/carrinho.js`, altere `const numero = '5522999999999'`
4. **Formulário**: Em `js/suporte.js`, substitua o mock `setTimeout` por `fetch('/api/contato', ...)`
5. **Autenticação**: Integre o botão "Entre ou Cadastre-se" do header

---

©2025 Oficina de Fibras Naturais
