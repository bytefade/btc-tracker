<template>
  <form @submit.prevent="addTransaction">
    <select v-model="form.type">
      <option value="compra">Compra</option>
      <option value="venda">Venda</option>
    </select>
    <input v-model="form.date" type="date" required />
    <input
      v-model="form.btcAmount"
      type="number"
      placeholder="Quantidade BTC"
      step="0.0001"
      required
    />
    <input
      v-model="form.brlPricePerBtc"
      type="number"
      placeholder="Preço unitário (BRL)"
      required
    />
    <input v-model="form.notes" placeholder="Notas" />
    <button type="submit">Inserir</button>
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
    console.error(err);
  }
};
</script>
