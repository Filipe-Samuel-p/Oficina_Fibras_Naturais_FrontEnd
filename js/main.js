// =============================================
// OFICINA DE FIBRAS NATURAIS — main.js
// Inicialização global: sidebar, header, badge
// =============================================

import { Cart } from './cart.js';

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

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarSidebar();
  atualizarBadge();
  iniciarCarrinhoBtns();
  verificarRoleAdmin();

  // Escuta atualizações do carrinho em qualquer aba
  window.addEventListener('carrinho:atualizado', atualizarBadge);
  window.addEventListener('storage', atualizarBadge); // cross-tab
});

function verificarRoleAdmin() {
  const token = getCookie("token");
  if (!token) return;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.roles) return;

  const userRoles = decoded.roles;
  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isCoordinator = userRoles.includes("ROLE_COORDINATOR");

  if (isAdmin || isCoordinator) {
      const adminArea = document.getElementById("sidebar-admin-area");
      if (adminArea) adminArea.style.display = "block";
  }
}

// ============================
// SIDEBAR
// ============================
function iniciarSidebar() {
  const sidebar    = document.getElementById('sidebar');
  const overlay    = document.getElementById('overlay');
  const menuBtn    = document.getElementById('menu-btn');
  const fecharBtn  = document.getElementById('sidebar-fechar');

  if (!sidebar) return;

  function abrir() {
    sidebar.classList.add('aberta');
    overlay.classList.add('visivel');
    document.body.classList.add('sem-scroll');
    menuBtn?.classList.add('aberto');
    menuBtn?.setAttribute('aria-expanded', 'true');
    fecharBtn?.focus();
  }

  function fechar() {
    sidebar.classList.remove('aberta');
    overlay.classList.remove('visivel');
    document.body.classList.remove('sem-scroll');
    menuBtn?.classList.remove('aberto');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.focus();
  }

  menuBtn?.addEventListener('click', () => {
    sidebar.classList.contains('aberta') ? fechar() : abrir();
  });

  fecharBtn?.addEventListener('click', fechar);
  overlay?.addEventListener('click', fechar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('aberta')) fechar();
  });

  // Trap focus dentro da sidebar
  sidebar.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusaveis = sidebar.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const primeiro = focusaveis[0];
    const último   = focusaveis[focusaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault(); último.focus();
    } else if (!e.shiftKey && document.activeElement === último) {
      e.preventDefault(); primeiro.focus();
    }
  });
}

// ============================
// BADGE DO CARRINHO
// ============================
function atualizarBadge() {
  const badges = document.querySelectorAll('#carrinho-badge');
  const total  = Cart.getTotalUnidades();
  badges.forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ============================
// BOTÕES "ADICIONAR AO CARRINHO"
// ============================
function iniciarCarrinhoBtns() {
  // Delegação de evento para botões carregados dinamicamente
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn || !btn.classList.contains('produto-card__btn')) return;

    const id  = parseInt(btn.dataset.id, 10);
    const card = btn.closest('.produto-card');
    const nome  = card?.querySelector('.produto-card__nome')?.textContent || 'Produto';
    const precoText = card?.querySelector('.produto-card__preco-atual')?.textContent || 'R$ 0,00';
    const preco = parseFloat(precoText.replace('R$ ', '').replace(',', '.')) || 0;
    const emoji = card?.querySelector('.produto-card__img')?.textContent?.trim() || '📦';

    Cart.adicionar({ id, nome, preco, emoji, quantidade: 1 });

    // Feedback visual
    btn.textContent = '✓ Adicionado!';
    btn.style.background = 'var(--verde-escuro)';
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.52L23 6H6"/>
        </svg>
        Adicionar ao Carrinho`;
      btn.style.background = '';
    }, 1500);

    atualizarBadge();
  });
}
