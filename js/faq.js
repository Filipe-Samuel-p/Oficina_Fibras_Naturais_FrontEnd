// =============================================
// OFICINA DE FIBRAS NATURAIS — faq.js
// Accordion de perguntas frequentes
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  iniciarFAQ();
});

function iniciarFAQ() {
  const itens = document.querySelectorAll('.faq-item');
  if (!itens.length) return;

  itens.forEach(item => {
    const btn      = item.querySelector('.faq-pergunta');
    const resposta = item.querySelector('.faq-resposta');
    if (!btn || !resposta) return;

    btn.addEventListener('click', () => {
      const estaAberto = item.classList.contains('aberto');

      // Fecha todos
      itens.forEach(i => {
        i.classList.remove('aberto');
        i.querySelector('.faq-pergunta')?.setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado se estava fechado
      if (!estaAberto) {
        item.classList.add('aberto');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
