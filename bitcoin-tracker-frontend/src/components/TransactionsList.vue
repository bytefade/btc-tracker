<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Extrato de transações
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
    </div>
    <div class="overflow-x-auto"></div>
    <table class="min-w-full border border-gray-200">
      <thead class="bg-orange-50">
        <tr>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Tipo</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Data</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">BTC</th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">
            Preço Unit. (BRL)
          </th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">
            Total(BRL)
          </th>
          <th class="py-2 px-4 text-left text-gray-700 font-semibold">Notas</th>
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
            {{ new Date(t.date).toLocaleDateString("pt-BR") }}
          </td>
          <td class="py-2 px-4">{{ t.btcAmount.toFixed(4) }}</td>
          <td class="py-2 px-4">
            {{
              t.brlPricePerBtc.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </td>
          <td class="py-2 px-4">
            {{
              t.totalBrl.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </td>
          <td class="py-2 px-4">{{ t.notes || "-" }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="summary.monthySales" class="mt-4 p-4 bg-orange-50 rounded-lg">
      <p class="text-gray-800 font-medium">
        Total Vendido no Mês: R$
        {{
          summary.monthySales.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
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
            : "⚠️ Acima de R$ 35.000 - Tribuável!"
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTransactionsStore } from "../stores/transactions";

const store = useTransactionsStore();
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); //YYYY-MM

const fetchTransactions = () => {
  //Valida formato YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(selectedMonth.value)) {
    console.error("Formato de mês inválido: ", selectedMonth.value);
    selectedMonth.value = new Date().toISOString().slice(0, 7); //Reseta para mês atual
  }
  console.log("Enviando mês: ", selectedMonth.value);
  store.fetchTransactions(selectedMonth.value);
};

const transactions = computed(() => store.transactions);
const summary = computed(() => store.summary);

fetchTransactions(); //Carga inicial
</script>
