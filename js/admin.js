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

const token = getCookie("token");
const telefoneLoja = document.getElementById("display-telefone-loja");

// Elementos do Modal Admin
const modalAddAdmin = document.getElementById("modal-add-admin");
const btnAddAdmin = document.getElementById("btn-add-admin");
const btnFecharModalAdmin = document.getElementById("fechar-modal-admin");
const formAddAdmin = document.getElementById("form-add-admin");

// Elementos do Modal Produto
const modalAddProduto = document.getElementById("modal-add-produto");
const btnAddProduto = document.getElementById("btn-add-produto");
const btnFecharModalProduto = document.getElementById("fechar-modal-produto");
const formAddProduto = document.getElementById("form-add-produto");

// Elementos do Modal Contato
const modalEditarContato = document.getElementById("modal-editar-contato");
const btnEditarContato = document.getElementById("btn-editar-contato");
const btnFecharModalContato = document.getElementById("fechar-modal-contato");
const formEditarContato = document.getElementById("form-editar-contato");

let shopInfosCache = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Inicialização básica
  if (!token) {
    window.location.href = "../index.html";
    return;
  }
  await carregarPedidosAdmin();
  shopInfosCache = await getShopInfos();
  if (shopInfosCache) {
    const phone = shopInfosCache.whatsappNumber;
    telefoneLoja.textContent = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }

  // --- Lógica do Modal Adicionar Admin ---
  const abrirModalAdmin = () => {
    modalAddAdmin.classList.add("visivel");
    document.body.style.overflow = "hidden";
  };

  const fecharModalAdmin = () => {
    modalAddAdmin.classList.remove("visivel");
    document.body.style.overflow = "";
    formAddAdmin.reset();
  };

  btnAddAdmin.addEventListener("click", abrirModalAdmin);
  btnFecharModalAdmin.addEventListener("click", fecharModalAdmin);

  // --- Lógica do Modal Adicionar Produto ---
  const abrirModalProduto = () => {
    modalAddProduto.classList.add("visivel");
    document.body.style.overflow = "hidden";
  };

  const fecharModalProduto = () => {
    modalAddProduto.classList.remove("visivel");
    document.body.style.overflow = "";
    formAddProduto.reset();
  };

  btnAddProduto.addEventListener("click", abrirModalProduto);
  btnFecharModalProduto.addEventListener("click", fecharModalProduto);

  // --- Lógica do Modal Editar Contato ---
  const abrirModalContato = () => {
    if (shopInfosCache) {
        document.getElementById("loja-whatsapp").value = shopInfosCache.whatsappNumber;
    }
    modalEditarContato.classList.add("visivel");
    document.body.style.overflow = "hidden";
  };

  const fecharModalContato = () => {
    modalEditarContato.classList.remove("visivel");
    document.body.style.overflow = "";
    formEditarContato.reset();
  };

  btnEditarContato.addEventListener("click", abrirModalContato);
  btnFecharModalContato.addEventListener("click", fecharModalContato);

  // Fechar modais ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modalAddAdmin) fecharModalAdmin();
    if (e.target === modalAddProduto) fecharModalProduto();
    if (e.target === modalEditarContato) fecharModalContato();
  });

  // Envio do formulário de Contato
  formEditarContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-contato");
    const whatsappNumber = document.getElementById("loja-whatsapp").value;

    try {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Salvando...";

      const res = await fetch(`${BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ whatsappNumber }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar contato");

      alert("Contato da loja atualizado com sucesso!");
      fecharModalContato();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar contato. Tente novamente.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Salvar Alterações";
    }
  });

  // Envio do formulário de Produto
  formAddProduto.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-produto");

    const produtoData = {
      name: document.getElementById("prod-nome").value,
      description: document.getElementById("prod-desc").value,
      pricePerUnit: parseFloat(document.getElementById("prod-preco").value),
      stockQuantity: parseInt(document.getElementById("prod-estoque").value),
      imageUrl: document.getElementById("prod-img").value,
      active: document.getElementById("prod-ativo").checked
    };

    try {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Cadastrando...";

      const res = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produtoData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar produto");

      alert("Produto cadastrado com sucesso!");
      fecharModalProduto();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto. Verifique os dados e tente novamente.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Cadastrar Produto";
    }
  });

  // Envio do formulário de Admin
  formAddAdmin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const btnSubmit = document.getElementById("btn-submit-admin");

    try {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Processando...";

      const res = await fetch(`${BASE_URL}/settings/invite-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Erro ao promover usuário");

      alert(`Usuário ${email} agora é um administrador!`);
      fecharModalAdmin();
    } catch (err) {
      console.error(err);
      alert("Erro ao promover usuário. Verifique o e-mail ou suas permissões.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Promover a Admin";
    }
  });

  // Outros Listeners
  document.getElementById("btn-ver-produtos-lista").addEventListener("click", () => {
    window.location.href = "/pages/loja.html";
  });

  document.getElementById("btn-listar-admins").addEventListener("click", () => {
    alert("Funcionalidade: Listar administradores do sistema");
  });
});

const carregarPedidosAdmin = async () => {
  const container = document.getElementById("lista-pedidos-admin");
  try {
    let pedidos = await getAllOrders();
    if (!pedidos || !pedidos.content || pedidos.content.length === 0) {
      container.innerHTML =
        '<p class="perfil-item-valor">Nenhum pedido encontrado no sistema.</p>';
      return;
    }
    renderizarPedidos(pedidos.content, container);
  } catch (err) {
    console.error("Erro ao carregar pedidos admin:", err);
    container.innerHTML =
      '<p class="perfil-item-valor" style="color: #C0392B">Erro ao carregar pedidos. Verifique se você tem permissão de administrador.</p>';
  }
};

const getAllOrders = async () => {
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return await res.json();
};

const renderizarPedidos = (pedidos, container) => {
  const ultimosPedidos = pedidos.slice(0, 5);
  const statusMap = {
    PENDING: { texto: "Pendente", classe: "status--pendente" },
    COMPLETED: { texto: "Concluído", classe: "status--concluido" },
    CANCELED: { texto: "Cancelado", classe: "status--cancelado" },
  };

  container.innerHTML = ultimosPedidos
    .map((pedido) => {
      const itensTexto = pedido.items
        ? pedido.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")
        : "Itens do pedido";

      const infoStatus = statusMap[pedido.status] || {
        texto: pedido.status,
        classe: "status--pendente",
      };
      const dataFormatada = new Date(pedido.moment).toLocaleDateString("pt-BR");
      const totalFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(pedido.totalAmount || pedido.total);

      const clienteNome = pedido.clientName || "Cliente";

      return `
          <div class="perfil-item-lista">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <a class="perfil-item-titulo" href=/pages/pedido.html?id=${pedido.id}>Pedido #${pedido.id} - ${clienteNome}</a>
                <span class="perfil-item-valor">Data: ${dataFormatada}</span>
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

const getShopInfos = async () => {
  if (!token) return;
  try {
    const res = await fetch(`${BASE_URL}/settings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};
