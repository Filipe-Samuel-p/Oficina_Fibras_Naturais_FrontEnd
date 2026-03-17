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

/**
 * Decodifica o payload de um JWT.
 */
function jwtDecode(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

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

// Elementos do Modal Listar Admins
const modalListarAdmins = document.getElementById("modal-listar-admins");
const btnListarAdmins = document.getElementById("btn-listar-admins");
const btnFecharModalListaAdmins = document.getElementById("fechar-modal-lista-admins");
const containerListaAdmins = document.getElementById("container-lista-admins");

let shopInfosCache = null;

document.addEventListener("DOMContentLoaded", async () => {
  // ... (código anterior mantido)
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

  // --- Lógica do Modal Listar Admins ---
  const renderizarListaAdmins = (admins) => {
    if (!admins || admins.length === 0) {
      containerListaAdmins.innerHTML = '<p class="perfil-item-valor">Nenhum administrador encontrado.</p>';
      return;
    }

    const decoded = jwtDecode(token);
    const isCoordinator = decoded && decoded.roles && decoded.roles.includes("ROLE_COORDINATOR");

    containerListaAdmins.innerHTML = admins.map(admin => `
      <div class="perfil-item-lista" style="padding: 12px 0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="perfil-avatar" style="width: 40px; height: 40px; font-size: 16px;">
            ${admin.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span class="perfil-item-titulo" style="font-size: 14px;">${admin.name}</span>
            <span class="perfil-item-valor" style="font-size: 12px;">${admin.email}</span>
          </div>
        </div>
        ${isCoordinator ? `
          <div style="display: flex; gap: 8px;">
            <button
              class="btn-promover-admin"
              data-id="${admin.id}"
              data-nome="${admin.name}"
              style="background: #27AE60; border: none; border-radius: 4px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"
              onmouseover="this.style.background='#219150'"
              onmouseout="this.style.background='#27AE60'"
              title="Promover para Coordenador"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
            <button
              class="btn-deletar-admin"
              data-id="${admin.id}"
              data-nome="${admin.name}"
              style="background: #C0392B; border: none; border-radius: 4px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"
              onmouseover="this.style.background='#A93226'"
              onmouseout="this.style.background='#C0392B'"
              title="Remover Administrador"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');
  };

  // Event delegation para botões da lista de admin
  containerListaAdmins.addEventListener("click", async (e) => {
    // Lógica para Deletar
    const btnDeletar = e.target.closest(".btn-deletar-admin");
    if (btnDeletar) {
      const adminId = btnDeletar.dataset.id;
      const adminNome = btnDeletar.dataset.nome;

      if (confirm(`Tem certeza que deseja remover o administrador "${adminNome}"?`)) {
        try {
          const res = await fetch(`${BASE_URL}/coordinator/admins/${adminId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });

          if (!res.ok) throw new Error("Erro ao remover administrador");

          alert("Administrador removido com sucesso!");
          const admins = await getAllAdmins();
          renderizarListaAdmins(admins);
        } catch (err) {
          console.error(err);
          alert("Erro ao remover administrador. Verifique suas permissões.");
        }
      }
      return;
    }

    // Lógica para Promover
    const btnPromover = e.target.closest(".btn-promover-admin");
    if (btnPromover) {
      const adminId = btnPromover.dataset.id;
      const adminNome = btnPromover.dataset.nome;

      if (confirm(`Deseja promover o administrador "${adminNome}" para Coordenador?`)) {
        try {
          const res = await fetch(`${BASE_URL}/coordinator/admins/${adminId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });

          if (!res.ok) throw new Error("Erro ao promover administrador");

          alert("Administrador promovido com sucesso!");
          const admins = await getAllAdmins();
          renderizarListaAdmins(admins);
        } catch (err) {
          console.error(err);
          alert("Erro ao promover administrador. Verifique suas permissões.");
        }
      }
      return;
    }
  });

  const abrirModalListaAdmins = async () => {
    modalListarAdmins.classList.add("visivel");
    document.body.style.overflow = "hidden";
    containerListaAdmins.innerHTML = '<p class="perfil-item-valor">Carregando...</p>';

    const admins = await getAllAdmins();
    renderizarListaAdmins(admins);
  };

  const fecharModalListaAdmins = () => {
    modalListarAdmins.classList.remove("visivel");
    document.body.style.overflow = "";
  };

  btnListarAdmins.addEventListener("click", abrirModalListaAdmins);
  btnFecharModalListaAdmins.addEventListener("click", fecharModalListaAdmins);

  // Máscara de telefone para o cadastro de admin
  document.getElementById("admin-telefone").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 10) {
      e.target.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
    } else {
      e.target.value = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim().replace(/-$/, "");
    }
  });

  // Fechar modais ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modalAddAdmin) fecharModalAdmin();
    if (e.target === modalAddProduto) fecharModalProduto();
    if (e.target === modalEditarContato) fecharModalContato();
    if (e.target === modalListarAdmins) fecharModalListaAdmins();
  });

  // ... (resto dos listeners de submit mantidos)

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

    const payload = {
      name: document.getElementById("admin-nome").value.trim(),
      email: document.getElementById("admin-email").value.trim(),
      phoneAdmin: document.getElementById("admin-telefone").value.trim(),
      password: document.getElementById("admin-senha").value
    };

    const btnSubmit = document.getElementById("btn-submit-admin");

    try {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Criando conta...";

      // Enviando para o endpoint de convite/criação de admin
      const res = await fetch(`${BASE_URL}/settings/invite-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar administrador");

      alert(`Administrador ${payload.name} criado com sucesso!`);
      fecharModalAdmin();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar administrador. Verifique os dados ou suas permissões.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Criar Administrador";
    }
  });

  // Outros Listeners
  document.getElementById("btn-ver-produtos-lista").addEventListener("click", () => {
    window.location.href = "/pages/loja.html";
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

const getAllAdmins = async () => {
  try {
    const res = await fetch(`${BASE_URL}/settings/admins`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    if (!res.ok) throw new Error("Erro ao carregar administradores!")
    return await res.json();
  } catch (error) {

  }
}
