const BASE_URL = "http://localhost:8080/api/v1";

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

function jwtDecode(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
}

const token = getCookie("token");
console.log(jwtDecode(token))


const modalBackdrop = document.getElementById("modal-perfil");
const modalFechar = document.getElementById("modal-perfil-fechar");
const btnAbrirModal = document.getElementById("btn-abrir-modal");
const formUpdatePerfil = document.getElementById("form-update-perfil");

const modalEndereco = document.getElementById("modal-endereco");
const modalEnderecoFechar = document.getElementById("modal-endereco-fechar");
const btnAbrirModalEndereco = document.getElementById(
  "btn-abrir-modal-endereco",
);
const formEndereco = document.getElementById("form-endereco");

const displayInicialPerfil = document.getElementById("inicial-perfil");

const displayNome = document.getElementById("display-nome");
const displayEmail = document.getElementById("display-email");
const displayTelefone = document.getElementById("display-telefone");

const displayBairroCidade = document.getElementById("display-bairro-cidade");
const displayReferencia = document.getElementById("display-referencia-endereco");
const displayRuaNumero = document.getElementById("display-rua-numero");
const displayCEP = document.getElementById("display-cep");

const editNome = document.getElementById("edit-nome");
const editTelefone = document.getElementById("edit-telefone");

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await carregarPerfil();
  await carregarPedidos();


  // Event Listeners para o Modal de Perfil
  btnAbrirModal.addEventListener("click", () => {
    if (!userData) return;
    editNome.value = userData.name || "";
    editTelefone.value = userData.phone || "";
    modalBackdrop.classList.add("visivel");
  });

  modalFechar.addEventListener("click", () =>
    modalBackdrop.classList.remove("visivel"),
  );

  // Event Listeners para o Modal de Endereço
  btnAbrirModalEndereco.addEventListener("click", () => {
    if (userData && userData.address) {
      document.getElementById("end-zipcode").value =
        userData.address.zipCode || "";
      document.getElementById("end-street").value =
        userData.address.street || "";
      document.getElementById("end-number").value =
        userData.address.number || "";
      document.getElementById("end-neighborhood").value =
        userData.address.neighborhood || "";
      document.getElementById("end-city").value = userData.address.city || "";
      document.getElementById("end-reference").value =
        userData.address.reference || "";
    }
    modalEndereco.classList.add("visivel");
  });

  modalEnderecoFechar.addEventListener("click", () =>
    modalEndereco.classList.remove("visivel"),
  );

  // Fechar modais ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove("visivel");
    if (e.target === modalEndereco) modalEndereco.classList.remove("visivel");
  });

  // Máscara de CEP
  document.getElementById("end-zipcode").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
  });

  // Lógica de envio do formulário de Perfil
  formUpdatePerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSalvar = document.getElementById("btn-salvar-perfil");
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    const updatedInfo = {
      name: editNome.value,
      phone: editTelefone.value.replace(/\D/g, ""),
    };

    try {
      const res = await fetch(`${BASE_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedInfo),
      });

      if (res.ok) {
        await carregarPerfil();
        modalBackdrop.classList.remove("visivel");
      } else {
        alert("Erro ao atualizar dados.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar Alterações";
    }
  });

  // Lógica de envio do formulário de Endereço
  formEndereco.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSalvar = document.getElementById("btn-salvar-endereco");
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    const addressDTO = {
      street: document.getElementById("end-street").value,
      zipCode: document.getElementById("end-zipcode").value,
      city: document.getElementById("end-city").value,
      neighborhood: document.getElementById("end-neighborhood").value,
      reference: document.getElementById("end-reference").value,
      number: document.getElementById("end-number").value,
    };

    console.log(addressDTO)


    try {
      if (userData && userData.address) {
        const res = await fetch(`${BASE_URL}/user/address`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(addressDTO),
        });
        if (res.ok) {
          await carregarPerfil();
          modalEndereco.classList.remove("visivel");
        } else {
          alert("Erro ao salvar endereço.");
        }
      } else {
          const res = await fetch(`${BASE_URL}/user/address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(addressDTO),
        });
        if (res.ok) {
          await carregarPerfil();
          modalEndereco.classList.remove("visivel");
        } else {
          alert("Erro ao salvar endereço.");
        }
      }

    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar Endereço";
    }
  });
});

const carregarPedidos = async () => {
  const container = document.getElementById("lista-pedidos");
  try {
    const pedidos = await getUserOrders();

    if (!pedidos || pedidos.length === 0) {
      container.innerHTML =
        '<p class="perfil-item-valor">Você ainda não realizou nenhum pedido.</p>';
      return;
    }

    renderizarPedidos(pedidos, container);
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    container.innerHTML =
      '<p class="perfil-item-valor" style="color: #C0392B">Não foi possível carregar os pedidos.</p>';
  }
};

const renderizarPedidos = (pedidos, container) => {
  // Pega apenas os 5 mais recentes
  const ultimosPedidos = pedidos.slice(0, 5);

  // Mapeamento de status: Tradução e Classe CSS
  const statusMap = {
    'PENDING':   { texto: 'Pendente',   classe: 'status--pendente' },
    'COMPLETED': { texto: 'Concluído',  classe: 'status--concluido' },
    'CANCELED':  { texto: 'Cancelado',  classe: 'status--cancelado' }
  };

  container.innerHTML = ultimosPedidos
    .map((pedido) => {
      // Formatação de itens
      const itensTexto = pedido.items
        ? pedido.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")
        : "Itens do pedido";

      // Obtém dados do mapa ou usa valores padrão
      const infoStatus = statusMap[pedido.status] || { texto: pedido.status, classe: 'status--pendente' };

      const dataFormatada = new Date(pedido.moment).toLocaleDateString(
        "pt-BR",
      );
      const totalFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(pedido.totalAmount || pedido.total);

      return `
          <div class="perfil-item-lista">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span class="perfil-item-titulo">Pedido #${pedido.id.toString().slice(-6).toUpperCase()}</span>
                <span class="perfil-item-valor">Realizado em: ${dataFormatada}</span>
              </div>
              <span class="status-badge ${infoStatus.classe}">${infoStatus.texto}</span>
            </div>
            <p class="perfil-item-valor" style="margin-top: 8px">${itensTexto}</p>
            <p class="perfil-item-titulo" style="margin-top: 4px">Total: ${totalFormatado}</p>
          </div>
        `;
    })
    .join("");
};

const carregarPerfil = async () => {
  try {
    const info = await getUserInfo();
    if (info) {
      userData = info;
      displayNome.textContent = info.name || "Não informado";
      displayEmail.textContent = info.email || "Não informado";
      displayTelefone.textContent = formatPhone(info.phone) || "Não informado";
      displayInicialPerfil.textContent = info.name.slice(0,1).toUpperCase() || "X"

      // Exibição do Endereço
      if (info.address) {
        displayBairroCidade.textContent = `${info.address.neighborhood}, ${info.address.city}`;
        displayReferencia.textContent = `Referência: ${info.address.reference}`;
        displayRuaNumero.textContent = `${info.address.street}, ${info.address.number}`;
        displayCEP.textContent = `CEP: ${info.address.zipCode}`;
      } else {
        displayBairroCidade.textContent = "Nenhum endereço cadastrado";
        displayReferencia.textContent = "";
        displayRuaNumero.textContent = "";
        displayCEP.textContent = "";
      }

      // Atualiza o "Olá, Usuário" no header
      const headerUser = document.querySelector(".header__usuario strong");
      if (headerUser && info.name) {
        headerUser.textContent = info.name.split(" ")[0];
      }
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
};

const getUserInfo = async () => {
  if (!token) return (window.location.href = "../index.html");
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
};

const getUserOrders = async () => {
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/orders/my-orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  data = await res.json();
  console.log(data);
  return data;
};

const formatPhone = (phone) => {
  if (!phone) return "";
  const ddd = phone.slice(0, 2);
  const number = phone.slice(2);
  return `(${ddd}) ${number}`;
};
