<template>
  <form
    @submit.prevent="addTransaction"
    class="bg-white shadow-md rouned-lg p-6"
  >
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Nova Transação</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        v-model="form.type"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="compra">Compra</option>
        <option value="venda">Venda</option>
      </select>
      <input
        v-model="form.date"
        type="date"
        class="border border-gray-300 rounded-lg p-2 focus:ouline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        v-model="form.btcAmount"
        type="number"
        placeholder="Quantidade BTC"
        step="0.0001"
        class="border border-gray-300 rounded-lg p-2 focus:ouline-none focus-ring-2 focus:ring-orange-500"
        required
      />
      <input
        v-model="form.brlPricePerBtc"
        type="number"
        placeholder="Preço unitário (BRL)"
        class="border border-gray-300 rounded-lg p-2 focus:ouline-none focus-ring-2 focus:ring-orange-500"
        required
      />
      <textarea
        v-model="form.notes"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md-col-span-2"
        placeholder="Notas"
      />
      <button
        type="submit"
        class="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
      >
        Inserir
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useTransactionsStore } from "../stores/transactions";

const store = useTransactionsStore();
const form = ref({
  type: "compra",
  date: new Date().toISOString().split("T")[0],
  btcAmount: 0,
  brlPricePerBtc: 0,
  notes: "",
});

const addTransaction = async () => {
  try {
    //Valida data antes de enviar
    const date = new Date(form.value.date);
    if (isNaN(date.getTime())) {
      console.error("Data inválida: ", form.value.date);
      alert("Data inválida. Escolha uma data válida.");
      return;
    }

    console.log("Enviando transação: ", form.value.date);

    const totalBrl = form.value.btcAmount * form.value.brlPricePerBtc;
    await api.post("/transactions", { ...form.value, totalBrl });
    store.fetchTransactions();
    form.value = {
      type: "compra",
      date: new Date().toISOString.split("T")[0],
      btcAmount: 0,
      brlPricePerBtc: 0,
      notes: "",
    };
  } catch (err) {
    console.error("Erro ao inserir transação: ", err.message);
    alert("Erro ao inserir transação: " + err.message);
  }
};
</script>
