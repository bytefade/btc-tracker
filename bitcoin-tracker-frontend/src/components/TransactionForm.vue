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
      <div class="relative">
        <input
          v-model="form.btcAmount"
          type="number"
          placeholder="Quantidade BTC"
          step="0.0001"
          class="border border-gray-300 rounded-lg p-2 focus:ouline-none focus-ring-2 focus:ring-orange-500 w-full"
          required
        />
        <p v-if="errors.btcAmount" class="text-red-500 text-xs mt-1">
          {{ errors.btcAmount }}
        </p>
      </div>
      <div class="relative">
        <input
          v-model="form.brlPricePerBtc"
          type="number"
          placeholder="Preço unitário (BRL)"
          class="border border-gray-300 rounded-lg p-2 focus:ouline-none focus-ring-2 focus:ring-orange-500 w-full"
          required
        />
        <p
          v-if="errors.brlPricePerBtc"
          class="text-red-500 text-xs mt-1 absolute"
        >
          {{ errors.brlPricePerBtc }}
        </p>
      </div>
      <textarea
        v-model="form.notes"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md-col-span-2"
        placeholder="Notas"
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {{ isSubmitting ? "Inserindo..." : "Inserir Transação" }}
      </button>
    </div>
    <div
      v-if="successMessage"
      class="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm"
    >
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from "vue";
import api from "../services/api";
import { useTransactionsStore } from "../stores/transactions";

const store = useTransactionsStore();
const form = reactive({
  type: "compra",
  date: new Date().toISOString().split("T")[0],
  btcAmount: "",
  brlPricePerBtc: "",
  notes: "",
});

const errors = reactive({
  btcAmount: "",
  brlPricePerBtc: "",
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const validateForm = () => {
  let valid = true;
  //Limpa erros anteriores
  errors.btcAmount = "";
  errors.brlPricePerBtc = "";

  //Valida campos
  if (!form.btcAmount || form.btcAmount <= 0) {
    errors.btcAmount = "Quantidade BTC deve ser maior que 0.";
    valid = false;
  }
  if (!form.brlPricePerBtc || form.brlPricePerBtc <= 0) {
    errors.brlPricePerBtc = "Preço unitário deve ser maior que 0.";
    valid = false;
  }
  if (!form.date) {
    errorMessage.value = "Data é obrigatória";
    valid = false;
  }
  return valid;
};

const addTransaction = async () => {
  successMessage.value = "";
  errorMessage.value = "";
  errors.btcAmount = "";
  errors.brlPricePerBtc = "";

  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const totalBrl = form.btcAmount * form.brlPricePerBtc;
    await api.post("/transactions", { ...form, totalBrl });
    successMessage.value = "Transação inserida com sucesso!";

    //Atualiza a listagem com o mês da nova transação
    const transactionMonth = form.date.substring(0, 7); //YYYY-MM
    store.setSelectedMonth(transactionMonth);
    store.fetchTransactions(transactionMonth);

    //Reseta formulário
    form.type = "compra";
    form.date = new Date().toISOString().split("T")[0];
    form.btcAmount = "";
    form.brlPricePerBtc = "";
    form.notes = "";
  } catch (err) {
    errorMessage.value =
      "Erro ao inserir transação: " + (err.response?.data?.msg || err.message);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
