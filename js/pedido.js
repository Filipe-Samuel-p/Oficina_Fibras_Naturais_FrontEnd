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

const statusMap = {
  PENDING: { texto: "Pendente", classe: "status--pendente" },
  COMPLETED: { texto: "Concluído", classe: "status--concluido" },
  CANCELED: { texto: "Cancelado", classe: "status--cancelado" },
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const token = getCookie("token");

  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  const orderInfoDiv = document.getElementById("order-info");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnConfirmar = document.getElementById("btn-confirmar");

  if (!orderId) {
    orderInfoDiv.innerHTML =
      '<p class="error">ID do pedido não encontrado na URL.</p>';
    return;
  }

  try {
    console.log(`Buscando informações do pedido: ${orderId}...`);

    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar pedido");

    const orderData = await response.json();
    const infoStatus = statusMap[orderData.status] || {
      texto: orderData.status,
      classe: "status--pendente",
    };

    // 1. Renderiza a estrutura básica e informações gerais
    orderInfoDiv.innerHTML = `
            <div class="perfil-item-lista">
                <span class="perfil-item-titulo">Número do Pedido</span>
                <span class="perfil-item-valor">#${orderData.id}</span>
            </div>
            <div class="perfil-item-lista">
                <span class="perfil-item-titulo">Status Atual</span>
                <span class="perfil-item-valor status-badge ${infoStatus.classe}">${infoStatus.texto}</span>
            </div>

            <!-- Seção de Itens -->
            <div class="perfil-item-lista" style="display: block;">
                <span class="perfil-item-titulo" style="margin-bottom: 8px; display: block;">Itens do Pedido</span>
                <div id="secao-itens-pedido" style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Itens serão inseridos aqui pelo map -->
                </div>
            </div>

            <div class="perfil-item-lista">
                <span class="perfil-item-titulo">Total</span>
                <span class="perfil-item-valor"><strong>R$${orderData.total.toFixed(2)}</strong></span>
            </div>
        `;

    // 2. Seleciona a div de itens e realiza o map
    const secaoItens = document.getElementById("secao-itens-pedido");

    if (orderData.items && orderData.items.length > 0) {
      secaoItens.innerHTML = orderData.items
        .map(
          (item) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed var(--cinza-borda); font-size: 14px;">
                <span style="color: var(--texto-escuro);">
                    <strong style="color: var(--verde-escuro);">${item.quantity}x</strong> ${item.productName || item.name}
                </span>
                <span style="color: var(--cinza-texto); font-weight: 600;">
                    R$ ${item.pricePerUnit.toFixed(2)}
                </span>
            </div>
        `,
        )
        .join("");
    } else {
      secaoItens.innerHTML =
        '<p class="perfil-item-valor">Nenhum item encontrado.</p>';
    }

    // Habilita os botões após carregar os dados
    if (orderData.status === "PENDING") {
      btnCancelar.disabled = false;
      btnConfirmar.disabled = false;
      btnCancelar.classList.remove("disabled");
      btnConfirmar.classList.remove("disabled");
    }
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    orderInfoDiv.innerHTML = `<p class="error">Não foi possível carregar os dados do pedido #${orderId}.</p>`;
  }

  // --- BLOCO 2: Lógica para atualizar o status ---
  async function updateOrderStatus(newStatus) {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar status");

      alert(`Pedido atualizado para ${newStatus} com sucesso!`);
      window.location.reload();
    } catch (error) {
      console.error(`Erro ao mudar status para ${newStatus}:`, error);
      alert("Falha ao processar solicitação. Tente novamente.");
    }
  }

  btnCancelar.addEventListener("click", () => updateOrderStatus("CANCELED"));
  btnConfirmar.addEventListener("click", () => updateOrderStatus("COMPLETED"));
});
