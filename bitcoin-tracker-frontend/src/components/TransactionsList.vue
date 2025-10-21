<template>
  <div>
    <h2>Extrato</h2>
    <input v-model="selectedMonth" type="month" @change="fetchTransactions" />
    <button @click="fetchTransactions">Filtrar Mês</button>
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Data</th>
          <th>BTC</th>
          <th>Preço Unit. (BRL)</th>
          <th>Total(BRL)</th>
          <th>Notas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t._id">
          <td>{{ t.type }}</td>
          <td>{{ new Date(t.date).toLocaleDateString("pt-BR") }}</td>
          <td>{{ t.btcAmount }}</td>
          <td>{{ t.brlPricePerBtc.toLocaleString("pt-BR") }}</td>
          <td>{{ t.totalBrl.toLocaleString("pt-BR") }}</td>
          <td>{{ t.notes }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="summary.monthySales">
      <p>
        Total Vendido no Mês: R$
        {{ summary.monthySales.toLocaleString("pt-BR") }}
      </p>
      <p v-if="summary.isExempt" style="color: green">
        ✅ Isento de IR (≤ R$ 35.000)
      </p>
      <p v-else style="color: red">⚠️ Acima de R$ 35.000 - Tributável!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTransactionsStore } from "../stores/transactions";

const store = useTransactionsStore();
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); //YYYY-MM

const fetchTransactions = () => {
  store.fetchTransactions(selectedMonth.value);
};

const transactions = computed(() => store.transactions);
const summary = computed(() => store.summary);

fetchTransactions(); //Cargae inicial
</script>
