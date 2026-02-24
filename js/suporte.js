// =============================================
// OFICINA DE FIBRAS NATURAIS — suporte.js
// Formulário de contato + validação
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('suporte-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarForm(form)) {
      enviarForm(form);
    }
  });

  // Validação em tempo real
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(campo => {
    campo.addEventListener('blur', () => validarCampo(campo));
    campo.addEventListener('input', () => limparErro(campo));
  });
});

// ============================
// Validação
// ============================
function validarForm(form) {
  let valido = true;

  form.querySelectorAll('[required]').forEach(campo => {
    if (!validarCampo(campo)) valido = false;
  });

  return valido;
}

function validarCampo(campo) {
  limparErro(campo);

  if (campo.hasAttribute('required') && !campo.value.trim()) {
    mostrarErro(campo, 'Este campo é obrigatório.');
    return false;
  }

  if (campo.type === 'email' && campo.value && !emailValido(campo.value)) {
    mostrarErro(campo, 'Insira um e-mail válido.');
    return false;
  }

  return true;
}

function mostrarErro(campo, mensagem) {
  const wrap = campo.closest('.form-grupo') || campo.parentElement;
  // Remove erro anterior
  wrap?.querySelector('.form-erro')?.remove();

  // Destaca o campo
  const input = campo.classList.contains('form-input')
    ? campo.closest('.form-input-wrap') || campo
    : campo;
  input.style.borderColor = 'var(--vermelho-off)';

  // Cria mensagem
  const erro = document.createElement('span');
  erro.className = 'form-erro';
  erro.setAttribute('role', 'alert');
  erro.textContent = mensagem;
  erro.style.cssText = 'font-size:11px;color:var(--vermelho-off);margin-top:2px;';
  wrap?.appendChild(erro);
}

function limparErro(campo) {
  const wrap = campo.closest('.form-grupo') || campo.parentElement;
  wrap?.querySelector('.form-erro')?.remove();
  const input = campo.classList.contains('form-input')
    ? campo.closest('.form-input-wrap') || campo
    : campo;
  input.style.borderColor = '';
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================
// Envio (mock)
// ============================
function enviarForm(form) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Simula chamada de API
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '✓ Mensagem enviada!';
    btn.style.background = '#2D6A4F';
    form.reset();

    setTimeout(() => {
      btn.textContent = 'Enviar Mensagem';
      btn.style.background = '';
    }, 3000);
  }, 1200);
}
