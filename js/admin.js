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

document.addEventListener("DOMContentLoaded", async () => {
  // Inicialização básica
  await carregarPedidosAdmin();
  const shopInfos = await getShopInfos()
  if (shopInfos) {
    const phone = shopInfos.whatsappNumber
    telefoneLoja.textContent = `(${phone.slice(0,2)}) ${phone.slice(2,7)}-${phone.slice(7)}`
  }

  // Listeners para botões de ação (apenas logs por enquanto ou redirecionamentos)
  document.getElementById("btn-add-produto").addEventListener("click", () => {
    alert("Funcionalidade: Abrir modal/página de adicionar produto");
  });

  document.getElementById("btn-ver-produtos").addEventListener("click", () => {
    window.location.href = "/pages/loja.html"; // Ou uma página de listagem admin se existir
  });

  document.getElementById("btn-add-admin").addEventListener("click", () => {
    alert("Funcionalidade: Abrir modal/página de adicionar administrador");
  });

  document.getElementById("btn-listar-admins").addEventListener("click", () => {
    alert("Funcionalidade: Listar administradores do sistema");
  });
});

const carregarPedidosAdmin = async () => {
  const container = document.getElementById("lista-pedidos-admin");
  try {
    // Tentando carregar todos os pedidos (endpoint genérico para admin)
    // Se falhar, usa o my-orders apenas para demonstração visual
    let pedidos = await getAllOrders();

    if (!pedidos || pedidos.length === 0) {
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
  // Tenta o endpoint de admin, se falhar cai no catch do carregarPedidosAdmin
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return null;
  }
  return await res.json();
};

const renderizarPedidos = (pedidos, container) => {
  // Pega apenas os 8 mais recentes para o admin

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

      // No admin, seria interessante mostrar quem fez o pedido se disponível
      const clienteNome = pedido.clientName || "Cliente";

      return `
          <div class="perfil-item-lista">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span class="perfil-item-titulo">Pedido #${pedido.id.toString().slice(-6).toUpperCase()} - ${clienteNome}</span>
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
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};
