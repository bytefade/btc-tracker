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
    <div class="overflow-x-auto"></div>
    <table class="min-w-full border border-gray-200">
      <thead class="bg-orange-50">
        <tr>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Tipo</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Data</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">BTC</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Preço</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Taxa</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Total</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Notas</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t._id" class="border-t">
          <td
            class="py-2 px-4"
            :class="t.type === 'compra' ? 'text-green-600' : 'text-red-600'"
          >
            {{ t.type.charAt(0).toUpperCase() + t.type.slice(1) }}
          </td>
          <td class="py-2 px-4">
            {{
              new Date(t.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
            }}
          </td>
          <td class="py-2 px-4">{{ formatBtc(t.btcAmount) }}</td>
          <td class="py-2 px-4">
            {{
              t.brlPricePerBtc.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </td>
          <td class="py-2 px-4">
            {{
              t.brokerageFee.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionsDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </td>
          <td class="py-2 px-4">
            {{
              t.totalBrl.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionsDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </td>
          <td class="py-2 px-4">{{ t.notes || "-" }}</td>
          <td class="py-2 px-4">
            <button
              @click="openDeleteModal(t._id)"
              class="text-red-600 hover:text-red-800 transition duration-200"
              title="Excluir transação"
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
    </table>

    <!-- Modal de Confirmação -->
    <DeleteModal
      :is-open="showDeleteModal"
      @close="closeDeleteModal"
      @confirm="deleteTransaction"
    />

    <div v-if="summary.monthlySales" class="mt-4 p-4 bg-orange-50 rounded-lg">
      <p class="text-gray-800 font-medium">
        Total Vendido no Mês: R$
        {{
          summary.monthlySales.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionsDigits: 2,
            maximumFractionsDigits: 2,
          })
        }}
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
const selectedMonth = computed({
  get: () => store.selectedMonth,
  set: (value) => store.setSelectedMonth(value),
});

const showDeleteModal = ref(false);
const transactionToDelete = ref(null);

const formatBtc = (value) => {
  if (!value) return "0,00000000";
  const num = Number(value);
  const str = num.toFixed(8).replace(".", ",");
  return str.replace(/,0+$/, ""); //Remove zeros à direita
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

const fetchTransactions = () => {
  if (!/^\d{4}-\d{2}$/.test(selectedMonth.value)) {
    selectedMonth.value = new Date().toISOString().slice(0, 7); //Reseta para mês atual
  }
  store.fetchTransactions(selectedMonth.value);
};

const transactions = computed(() => store.transactions);
const summary = computed(() => store.summary);

onMounted(() => {
  fetchTransactions();
});
</script>
