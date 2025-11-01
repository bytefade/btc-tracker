<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Extrato de transações (BRL)
    </h2>
    <div class="flex flex-col md:flex-row md-items-center mb-4 gap-2">
      <input
        v-model="selectedMonth"
        type="month"
        @change="fetchTransactions"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        @click="fetchTransactions"
        class="bg-orange-500 hover-bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Filtrar Mês
      </button>
      <!-- <button>Export CSV</button> -->
    </div>
    <div class="overflow-x-auto -mx-6 px-6">
      <div class="inline-block min-w-full align-middle">
        <table class="min-w-full divide-y border border-gray-200">
          <thead class="bg-orange-50">
            <tr>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Data
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                BTC
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Preço
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Taxa
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Total
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Notas
              </th>
              <th
                class="py-3 px-4 text-left text-xs text-gray-700 font-medium uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="t in sortedTransactions" :key="t._id">
              <td
                class="py-3 px-4 whitespace-nowrap"
                :class="t.type === 'compra' ? 'text-green-600' : 'text-red-600'"
              >
                {{ t.type.charAt(0).toUpperCase() + t.type.slice(1) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                {{ formatDate(t.date) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap font-mono text-sm">
                {{ formatBtc(t.btcAmount) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap text-sm">
                {{ formatCurrency(t.brlPricePerBtc) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap text-sm">
                {{ formatCurrency(t.brokerageFee) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap text-sm">
                {{ formatCurrency(t.totalBrl) }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ t.notes || "-" }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <button
                  @click="openDeleteModal(t._id)"
                  class="text-red-600 hover:text-red-800 transition duration-200 focus:outline-none"
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-orange-100 font-semibold">
            <tr>
              <td colspan="2" class="py-3 px-4 text-left">Totais do mês</td>
              <td class="py-3 px-4 text-sm">{{ formatBtc(totals.btc) }}</td>
              <td class="py-3 px-4 text-sm">-</td>
              <td class="py-3 px-4 text-sm">
                {{ formatCurrency(totals.fee) }}
              </td>
              <td class="py-3 px-4 text-sm">
                {{ formatCurrency(totals.total) }}
              </td>
              <td colspan="2" class="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <!-- Modal de Confirmação -->
    <DeleteModal
      :is-open="showDeleteModal"
      @close="closeDeleteModal"
      @confirm="deleteTransaction"
    />

    <div v-if="summary.monthlySales" class="mt-6 p-4 bg-orange-50 rounded-lg">
      <p class="text-gray-800 font-medium">
        Total Vendido no Mês: R$
        {{ formatCurrency(summary.monthlySales) }}
      </p>
      <p
        class="mt-2 font-semibold"
        :class="summary.isExempt ? ' text-green-600' : 'text-red-600'"
      >
        {{
          summary.isExempt
            ? "✅ Isento de IR (<= R$ 35.000)"
            : "⚠️ Acima de R$ 35.000 - Tributável."
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useTransactionsStore } from "../stores/transactions";
import api from "../services/api";
import DeleteModal from "./DeleteModal.vue";

const store = useTransactionsStore();
const selectedMonth = ref(new Date().toISOString().slice(0, 7));
const showDeleteModal = ref(false);
const transactionToDelete = ref(null);

const formatBtc = (value) => {
  if (!value) return "0,00000000";
  return Number(value)
    .toFixed(8)
    .replace(".", ",")
    .replace(/0+$/, "")
    .replace(/,$/, "");
};

const formatCurrency = (value) => {
  if (!value) return "R$ 0,00";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const sortedTransactions = computed(() => {
  return [...store.transactions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
});

const totals = computed(() => {
  const btcComprado = store.transactions
    .filter((t) => t.type === "compra")
    .reduce((sum, t) => sum + t.btcAmount, 0);

  const btcVendido = store.transactions
    .filter((t) => t.type === "venda")
    .reduce((sum, t) => sum + t.btcAmount, 0);

  const taxaTotal = store.transactions.reduce(
    (sum, t) => sum + (t.brokerageFee || 0),
    0
  );

  const totalComprado = store.transactions
    .filter((t) => t.type === "compra")
    .reduce((sum, t) => sum + t.totalBrl, 0);

  const totalVendido = store.transactions
    .filter((t) => t.type === "venda")
    .reduce((sum, t) => sum + t.totalBrl, 0);

  return {
    btc: btcComprado - btcVendido,
    fee: taxaTotal,
    total: totalComprado - totalVendido,
  };
});

const fetchTransactions = async () => {
  // const [yeah, month] = selectedMonth.value.split("-");
  // const start = new Date(yeah, month - 1, 1);
  // const end = new Date(yeah, month, 0, 23, 59, 59, 999); // Último milissegundo do mês

  try {
    const res = await api.get("/transactions", {
      params: { month: selectedMonth.value },
    });
    store.transactions = res.data.transactions;
    store.summary = res.data.summary;
  } catch (err) {
    console.error("Erro ao carregar transações", err);
  }
};

const openDeleteModal = (id) => {
  transactionToDelete.value = id;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  transactionToDelete.value = null;
};

const deleteTransaction = async () => {
  if (!transactionToDelete.value) return;

  try {
    await api.delete(`/transactions/${transactionToDelete.value}`);
    //Atualiza listagem
    await store.fetchTransactions(selectedMonth.value);
    closeDeleteModal();
  } catch (err) {
    console.error("Erro ao excluir transação:", err);
    alert("Erro ao excluir transação. Tente novamente.");
  }
};

// const transactions = computed(() => store.transactions);
const summary = computed(() => store.summary);

onMounted(() => {
  fetchTransactions();
});
</script>
