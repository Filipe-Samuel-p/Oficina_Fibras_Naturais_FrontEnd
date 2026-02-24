// =============================================
// OFICINA DE FIBRAS NATURAIS — auth.js
// Modal de Login e Cadastro
// =============================================

const BASE_URL = 'http://localhost:8080/api/v1';


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  injetarHTMLModal();
  checkLoginStatus(); // Check login status on page load
  vincularHeaderBtn();
  vincularEventosModal();

  // Attach event listener to the logout button
  const logoutButton = document.querySelector('.sidebar__sair-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});


// Verifica status de login ao carregar a página
function checkLoginStatus() {
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  if (userName && token) {
    atualizarHeaderUsuario(userName);
  } else {
    // Optionally clear any stale login data if only one is present
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
  }
}


// Injeta HTML do modal no <body>
function injetarHTMLModal() {
  if (document.getElementById('modal-auth')) return;

  const html = `
  <div id="modal-auth" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-titulo">

    <div class="modal">
      <button class="modal__fechar" id="modal-auth-fechar" aria-label="Fechar">✕</button>

      <div class="auth-modal__corpo">

        <!-- Toast de feedback -->
        <div class="auth-toast" id="auth-toast" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span id="auth-toast-txt"></span>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab ativo" id="tab-login"    role="tab" aria-selected="true"  aria-controls="painel-login">Entrar</button>
          <button class="auth-tab"        id="tab-cadastro" role="tab" aria-selected="false" aria-controls="painel-cadastro">Criar Conta</button>
        </div>

        <!-- ===== PAINEL LOGIN ===== -->
        <div class="auth-painel ativo" id="painel-login" role="tabpanel" aria-labelledby="tab-login">
          <h2 class="auth-painel__titulo" id="auth-titulo">Bem-vindo de volta!</h2>
          <p class="auth-painel__sub">Faça login para acessar sua conta</p>

          <form class="auth-form" id="form-login" novalidate>

            <div class="form-grupo">
              <label class="form-label" for="login-email">E-mail</label>
              <div class="form-input-wrap">
                <span class="form-icone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input class="form-input" type="email" id="login-email" name="email" placeholder="seu@email.com" autocomplete="email" required />
              </div>
              <span class="campo-erro" id="login-email-erro" role="alert"></span>
            </div>

            <div class="form-grupo">
              <label class="form-label" for="login-senha">Senha</label>
              <div class="senha-wrap">
                <div class="form-input-wrap">
                  <span class="form-icone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input class="form-input" type="password" id="login-senha" name="password" placeholder="••••••••" autocomplete="current-password" required />
                </div>
                <button type="button" class="senha-olho" data-alvo="login-senha" aria-label="Mostrar senha">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-olho">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="campo-erro" id="login-senha-erro" role="alert"></span>
            </div>

            <span class="auth-esqueci" id="btn-esqueci" tabindex="0" role="button">Esqueci minha senha</span>

            <button type="submit" class="auth-btn-submit" id="btn-login-submit">
              Entrar
            </button>

          </form>

          <p class="auth-alterar">Não tem conta?
            <a id="ir-cadastro" tabindex="0">Criar conta grátis</a>
          </p>
        </div>

        <!-- ===== PAINEL CADASTRO ===== -->
        <div class="auth-painel" id="painel-cadastro" role="tabpanel" aria-labelledby="tab-cadastro">
          <h2 class="auth-painel__titulo">Criar conta</h2>
          <p class="auth-painel__sub">Preencha os dados abaixo para se cadastrar</p>

          <form class="auth-form" id="form-cadastro" novalidate>

            <div class="form-grupo">
              <label class="form-label" for="cad-nome">Nome completo <span style="color:#C0392B">*</span></label>
              <div class="form-input-wrap">
                <span class="form-icone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input class="form-input" type="text" id="cad-nome" name="name" placeholder="Fulano da Silva" autocomplete="name" required />
              </div>
              <span class="campo-erro" id="cad-nome-erro" role="alert"></span>
            </div>

            <div class="form-grupo">
              <label class="form-label" for="cad-email">E-mail <span style="color:#C0392B">*</span></label>
              <div class="form-input-wrap">
                <span class="form-icone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input class="form-input" type="email" id="cad-email" name="email" placeholder="seu@email.com" autocomplete="email" required />
              </div>
              <span class="campo-erro" id="cad-email-erro" role="alert"></span>
            </div>

            <div class="form-grupo">
              <label class="form-label" for="cad-telefone">Telefone <span style="color:#C0392B">*</span></label>
              <div class="form-input-wrap">
                <span class="form-icone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .98h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                <input class="form-input" type="tel" id="cad-telefone" name="phone" placeholder="(00) 00000-0000" autocomplete="tel" required />
              </div>
              <span class="campo-erro" id="cad-telefone-erro" role="alert"></span>
            </div>

            <div class="form-grupo">
              <label class="form-label" for="cad-senha">Senha <span style="color:#C0392B">*</span></label>
              <div class="senha-wrap">
                <div class="form-input-wrap">
                  <span class="form-icone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input class="form-input" type="password" id="cad-senha" name="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
                </div>
                <button type="button" class="senha-olho" data-alvo="cad-senha" aria-label="Mostrar senha">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-olho">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <span class="campo-erro" id="cad-senha-erro" role="alert"></span>
            </div>

            <button type="submit" class="auth-btn-submit" id="btn-cad-submit">
              Criar Conta
            </button>

            <p class="auth-termos">
              Ao criar uma conta você concorda com os
              <a href="#">Termos de Uso</a> e a
              <a href="#">Política de Privacidade</a>.
            </p>

          </form>

          <p class="auth-alterar">Já tem conta?
            <a id="ir-login" tabindex="0">Entrar</a>
          </p>
        </div>

      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}


// Conecta o botão do header ao modal

function vincularHeaderBtn() {
  const handleHeaderButtonClick = () => {
    const token = localStorage.getItem('token');
    if (!token) { // Only open modal if not logged in
      abrirModal('login');
    } else {
        // Optionally, add logic here for logged-in users, e.g., show a profile menu
        console.log('User is logged in, not opening login modal.');
        // For demonstration, let's add a simple alert
        // alert(`Olá, ${localStorage.getItem('userName')}! Você já está logado.`);
    }
  };

  const handleHeaderButtonKeydown = (e) => {
    const token = localStorage.getItem('token');
    if (!token && (e.key === 'Enter' || e.key === ' ')) { // Only open modal if not logged in
      abrirModal('login');
    }
  };

  // Espera o DOM — o header pode ser injetado depois
  const tentarVincular = () => {
    const btnUsuario = document.querySelector('.header__usuario');
    if (btnUsuario) {
      btnUsuario.style.cursor = 'pointer'; // Always set cursor to pointer
      btnUsuario.setAttribute('role', 'button');
      btnUsuario.setAttribute('tabindex', '0');
      btnUsuario.setAttribute('aria-label', 'Entrar ou criar conta');

      // Remove existing listeners to prevent duplicates if this function is called multiple times
      btnUsuario.removeEventListener('click', handleHeaderButtonClick);
      btnUsuario.removeEventListener('keydown', handleHeaderButtonKeydown);

      // Add new listeners
      btnUsuario.addEventListener('click', handleHeaderButtonClick);
      btnUsuario.addEventListener('keydown', handleHeaderButtonKeydown);
    }
  };

  tentarVincular();
  // Fallback caso header seja injetado tarde
  setTimeout(tentarVincular, 300);
}


// Eventos internos do modal
function vincularEventosModal() {

  document.addEventListener('click', (e) => {
    if (e.target.closest('#modal-auth-fechar') || e.target.id === 'modal-auth') {
      fecharModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });

  // Tabs
  document.addEventListener('click', (e) => {
    if (e.target.id === 'tab-login')    mudarTab('login');
    if (e.target.id === 'tab-cadastro') mudarTab('cadastro');
    if (e.target.id === 'ir-cadastro')  mudarTab('cadastro');
    if (e.target.id === 'ir-login')     mudarTab('login');
  });

  // Toggle olho da senha
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.senha-olho');
    if (!btn) return;
    const inputId = btn.dataset.alvo;
    const input   = document.getElementById(inputId);
    if (!input) return;
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    btn.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
    // Troca ícone
    btn.querySelector('svg').innerHTML = mostrar
      ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  // Máscara de telefone
  document.addEventListener('input', (e) => {
    if (e.target.id === 'cad-telefone') {
      e.target.value = mascaraTelefone(e.target.value);
    }
  });

  // Submit login
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'form-login') {
      e.preventDefault();
      handleLogin(e.target);
    }
    if (e.target.id === 'form-cadastro') {
      e.preventDefault();
      handleCadastro(e.target);
    }
  });
}

// ============================
// Abrir / fechar modal
// ============================
function abrirModal(aba = 'login') {
  const modal = document.getElementById('modal-auth');
  if (!modal) return;
  mudarTab(aba);
  modal.classList.add('visivel');
  document.body.classList.add('sem-scroll');
  setTimeout(() => document.getElementById('modal-auth-fechar')?.focus(), 50);
}

function fecharModal() {
  const modal = document.getElementById('modal-auth');
  if (!modal) return;
  modal.classList.remove('visivel');
  document.body.classList.remove('sem-scroll');
}


// Trocar aba
function mudarTab(aba) {
  const tabLogin    = document.getElementById('tab-login');
  const tabCadastro = document.getElementById('tab-cadastro');
  const painelLogin    = document.getElementById('painel-login');
  const painelCadastro = document.getElementById('painel-cadastro');
  const toast = document.getElementById('auth-toast');
  if (!tabLogin) return;

  // Esconde toast
  toast?.classList.remove('visivel');

  if (aba === 'login') {
    tabLogin.classList.add('ativo');    tabLogin.setAttribute('aria-selected', 'true');
    tabCadastro.classList.remove('ativo'); tabCadastro.setAttribute('aria-selected', 'false');
    painelLogin.classList.add('ativo');
    painelCadastro.classList.remove('ativo');
    document.getElementById('login-email')?.focus();
  } else {
    tabCadastro.classList.add('ativo');  tabCadastro.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('ativo'); tabLogin.setAttribute('aria-selected', 'false');
    painelCadastro.classList.add('ativo');
    painelLogin.classList.remove('ativo');
    document.getElementById('cad-nome')?.focus();
  }
}


// Handlers de submit (mock)
async function handleLogin(form) {
  let valido = true;

  const emailInput = form.querySelector('#login-email');
  const senhaInput = form.querySelector('#login-senha');

  limparErro('login-email-erro');
  limparErro('login-senha-erro');

  if (!emailInput.value.trim() || !emailValido(emailInput.value)) {
    setErro('login-email-erro', 'Insira um e-mail válido.');
    valido = false;
  }
  // Removed password length validation for login
  // if (senhaInput.value.length < 6) {
  //   setErro('login-senha-erro', 'A senha deve ter ao menos 6 caracteres.');
  //   valido = false;
  // }
  if (!valido) return;

  const btn = document.getElementById('btn-login-submit');
  btn.disabled = true;
  btn.textContent = 'Entrando...';

  const payload = {
    email: emailInput.value.trim(),
    password: senhaInput.value,
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Erro: ${response.status} ${response.statusText || 'Erro desconhecido'}`;
      try {
        const errorData = await response.json();
        // Use errorData.message if available, otherwise fall back to generic or statusText
        errorMessage = errorData.message || response.statusText || errorMessage;
      } catch (jsonError) {
        // If response is not JSON or is empty, use the generic message
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    document.writeln(data)
    const userNameToStore = data.name && typeof data.name === 'string' ? data.name : 'Usuário';

    localStorage.setItem('token', data.token); // Store the token
    localStorage.setItem('userName', userNameToStore); // Store user name or placeholder

    mostrarToast('Login realizado com sucesso! ✓');
    atualizarHeaderUsuario(userNameToStore); // Use the processed name
    setTimeout(fecharModal, 1400);

  } catch (error) {
    console.error('[AUTH] Erro no login:', error);
    mostrarToast(`Erro: ${error.message || 'Falha ao conectar com o servidor.'}`);
    // Optionally, set specific error messages for email/password if the backend provides them
    if (error.message.includes('Credenciais inválidas')) {
        setErro('login-email-erro', 'E-mail ou senha inválidos.');
        setErro('login-senha-erro', 'E-mail ou senha inválidos.');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}

async function handleCadastro(form) {
  let valido = true;

  const nomeInput     = form.querySelector('#cad-nome');
  const emailInput    = form.querySelector('#cad-email');
  const telefoneInput = form.querySelector('#cad-telefone');
  const senhaInput    = form.querySelector('#cad-senha');


  ['cad-nome-erro','cad-email-erro','cad-telefone-erro','cad-senha-erro'].forEach(limparErro);

  if (!nomeInput.value.trim() || nomeInput.value.trim().length < 3) {
    setErro('cad-nome-erro', 'Informe seu nome completo.');
    valido = false;
  }
  if (!emailInput.value.trim() || !emailValido(emailInput.value)) {
    setErro('cad-email-erro', 'Insira um e-mail válido.');
    valido = false;
  }
  if (!telefoneInput.value.trim() || telefoneInput.value.replace(/\D/g,'').length < 10) {
    setErro('cad-telefone-erro', 'Informe um telefone válido.');
    valido = false;
  }
  if (senhaInput.value.length < 6) {
    setErro('cad-senha-erro', 'A senha deve ter ao menos 6 caracteres.');
    valido = false;
  }
  if (!valido) return;

  const btn = document.getElementById('btn-cad-submit');
  btn.disabled = true;
  btn.textContent = 'Criando conta...';

  const payload = {
    name:     nomeInput.value.trim(),
    email:    emailInput.value.trim(),
    phone:    telefoneInput.value.replace(/\D/g,''), // Send only numbers
    password: senhaInput.value,
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Erro: ${response.status} ${response.statusText || 'Erro desconhecido'}`;
      try {
        const errorData = await response.json();
        // Use errorData.message if available, otherwise fall back to generic or statusText
        errorMessage = errorData.message || response.statusText || errorMessage;
      } catch (jsonError) {
        // If response is not JSON or is empty, use the generic message
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const userNameToStore = data.name && typeof data.name === 'string' ? data.name : 'Usuário';
    const firstNameForToast = userNameToStore.split(' ')[0];

    mostrarToast(`Conta criada com sucesso! Bem-vindo(a), ${firstNameForToast}! ✓`);

    // Automatically log in after successful registration
    // Prepare a mock form element for handleLogin
    const loginForm = {
        querySelector: (selector) => {
            if (selector === '#login-email') return { value: emailInput.value };
            if (selector === '#login-senha') return { value: senhaInput.value };
            return null;
        }
    };
    await handleLogin(loginForm); // Pass the values to handleLogin

    form.reset();
    setTimeout(fecharModal, 1800);

  } catch (error) {
    console.error('[AUTH] Erro no cadastro:', error);
    mostrarToast(`Erro: ${error.message || 'Falha ao conectar com o servidor.'}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar Conta';
  }
}


// Utilitários
function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function setErro(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function limparErro(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function mascaraTelefone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
}

function mostrarToast(msg) {
  const toast = document.getElementById('auth-toast');
  const txt   = document.getElementById('auth-toast-txt');
  if (!toast || !txt) return;
  txt.textContent = msg;
  toast.classList.add('visivel');
}

function atualizarHeaderUsuario(nome) {
  document.querySelectorAll('.header__usuario').forEach(el => {
    if (nome) {
      const firstName = nome.split(' ')[0]; // Get only the first name
      el.innerHTML = `<span>Olá,</span><span>${firstName}</span>`;
      el.style.cursor = 'default';
      el.removeAttribute('aria-label');
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
    } else {
      // Default state when no user is logged in
      el.innerHTML = `Entrar ou criar conta`;
      el.style.cursor = 'pointer';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Entrar ou criar conta');
    }
  });
}

// Expõe para uso externo (ex: botão de outro lugar abrir o modal)
window.abrirModalAuth = abrirModal;


// Logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  atualizarHeaderUsuario(null); // Update header to logged out state
  window.location.reload(); // Reload the page to clear all session-dependent data and UI
}

// Expõe para uso externo se necessário (e.g., para o botão no index.html)
window.handleLogout = handleLogout;

