<template>
  <form
    @submit.prevent="addTransaction"
    class="bg-white shadow-md rounded-lg p-6"
  >
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Nova Transação</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Tipo -->
      <select
        v-model="form.type"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="compra">Compra</option>
        <option value="venda">Venda</option>
      </select>

      <!-- Data -->
      <input
        v-model="form.date"
        type="date"
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />

      <!-- BTC -->
      <div class="relative">
        <input
          v-model="form.btcAmount"
          @input="formatBtcAmount"
          type="text"
          placeholder="Quantidade BTC"
          class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
          :class="
            errors.btcAmount
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-orange-500'
          "
          required
        />
        <p
          v-if="errors.btcAmount"
          class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0"
        >
          {{ errors.btcAmount }}
        </p>
      </div>

      <!-- Preço Unitário -->
      <div class="relative">
        <input
          v-model="form.brlPricePerBtc"
          @input="formatBrl"
          type="text"
          placeholder="Preço unitário (BRL)"
          class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
          :class="
            errors.brlPricePerBtc
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-orange-500'
          "
          required
        />
        <p
          v-if="errors.brlPricePerBtc"
          class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0"
        >
          {{ errors.brlPricePerBtc }}
        </p>
      </div>

      <!-- Linha da Taxa: Select + Input + Toggle -->
      <div
        class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
      >
        <!-- Tipo de Taxa -->
        <select
          v-model="form.brokerageFeeType"
          class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Sem taxa</option>
          <option value="reais">Taxa em Reais</option>
          <option value="porcentagem">Taxa em %</option>
        </select>

        <!-- Valor da Taxa + Toggle -->
        <div class="flex items-center gap-2">
          <div class="flex-1 relative">
            <input
              v-if="form.brokerageFeeType"
              v-model="form.brokerageFeeValue"
              :placeholder="
                form.brokerageFeeType === 'reais' ? 'Ex: 29,85' : 'Ex: 0,50'
              "
              @input="
                form.brokerageFeeType === 'reais'
                  ? formatBrl($event, 'brokerageFeeValue')
                  : formatPercentage
              "
              type="text"
              class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              :class="
                errors.brokerageFeeValue
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-orange-500'
              "
            />
            <p
              v-if="errors.brokerageFeeValue"
              class="text-red-500 text-xs mt-1 absolute -bottom-5 left-0"
            >
              {{ errors.brokerageFeeValue }}
            </p>
          </div>

          <!-- Toggle "Calcular" -->
          <label
            class="flex items-center cursor-pointer"
            title="Deduzir taxa do total"
          >
            <input
              type="checkbox"
              v-model="form.calculateFee"
              class="sr-only peer"
            />
            <div
              class="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
            <span
              class="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap"
              >Calcular</span
            >
          </label>
        </div>
      </div>

      <!-- Total (somente leitura) -->
      <div class="md:col-span-2 p-4 bg-orange-50 rounded-lg">
        <p class="text-lg font-semibold text-gray-800">
          Total:
          {{
            calculateTotal().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
      </div>

      <!-- Notas -->
      <textarea
        v-model="form.notes"
        placeholder="Notas (opcional)"
        class="md:col-span-2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        rows="2"
      ></textarea>

      <!-- Botão -->
      <button
        type="submit"
        class="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Inserindo..." : "Inserir Transação" }}
      </button>
    </div>

    <div
      v-if="successMessage"
      class="mt-6 bg-green-100 text-green-700 p-3 rounded-lg text-sm"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mt-6 bg-red-100 text-red-700 p-3 rounded-lg text-sm"
    >
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";
import api from "../services/api";
import { useTransactionsStore } from "../stores/transactions";

const store = useTransactionsStore();
const form = reactive({
  type: "compra",
  date: new Date().toISOString().split("T")[0],
  btcAmount: "",
  brlPricePerBtc: "",
  brokerageFeeType: "",
  brokerageFeeValue: "",
  calculateFee: false, // padrão: calcular
  notes: "",
});
const errors = reactive({
  btcAmount: "",
  brlPricePerBtc: "",
  brokerageFeeValue: "",
});
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// --- Formatação ---
const formatBtcAmount = (e) => {
  let v = e.target.value.replace(/[^0-9.]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) v = `${parts[0]}.${parts[1]}`;
  if (parts[1] && parts[1].length > 8)
    v = `${parts[0]}.${parts[1].slice(0, 8)}`;
  form.btcAmount = v;
};

const formatBrl = (e, field = "brlPricePerBtc") => {
  let v = e.target.value.replace(/[^0-9]/g, "");
  if (!v) {
    form[field] = "";
    return;
  }
  const num = parseFloat(v) / 100;
  form[field] = num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatPercentage = (e) => {
  let v = e.target.value.replace(/[^0-9.]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) v = `${parts[0]}.${parts[1]}`;
  if (parts[1] && parts[1].length > 2)
    v = `${parts[0]}.${parts[1].slice(0, 2)}`;
  form.brokerageFeeValue = v;
};

// --- Cálculo do Total ---
const calculateTotal = () => {
  const btc = parseFloat(form.btcAmount) || 0;
  const price =
    parseFloat(form.brlPricePerBtc.replace(/\./g, "").replace(",", ".")) || 0;
  let total = btc * price;

  if (form.calculateFee && form.brokerageFeeType && form.brokerageFeeValue) {
    const feeValue = parseFloat(form.brokerageFeeValue.replace(",", ".")) || 0;
    if (form.brokerageFeeType === "reais") {
      total -= feeValue;
    } else if (form.brokerageFeeType === "porcentagem") {
      total -= (feeValue / 100) * (btc * price);
    }
  }

  return total > 0 ? total : 0;
};

// --- Validação ---
const validateForm = () => {
  let valid = true;
  errors.btcAmount = errors.brlPricePerBtc = errors.brokerageFeeValue = "";

  const btc = parseFloat(form.btcAmount);
  if (isNaN(btc) || btc <= 0) {
    errors.btcAmount = "BTC inválido";
    valid = false;
  }

  const price = parseFloat(
    form.brlPricePerBtc.replace(/\./g, "").replace(",", ".")
  );
  if (isNaN(price) || price <= 0) {
    errors.brlPricePerBtc = "Preço inválido";
    valid = false;
  }

  if (form.brokerageFeeType && form.brokerageFeeValue) {
    const fee = parseFloat(form.brokerageFeeValue.replace(",", "."));
    if (isNaN(fee) || fee < 0) {
      errors.brokerageFeeValue = "Taxa inválida";
      valid = false;
    }
  }

  return valid;
};

// --- Envio ---
const addTransaction = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;
  successMessage.value = errorMessage.value = "";

  try {
    const btc = parseFloat(form.btcAmount);
    const price = parseFloat(
      form.brlPricePerBtc.replace(/\./g, "").replace(",", ".")
    );
    const total = calculateTotal();

    const payload = {
      type: form.type,
      date: form.date,
      btcAmount: btc,
      brlPricePerBtc: price,
      totalBrl: total,
      notes: form.notes,
    };

    if (form.brokerageFeeType && form.brokerageFeeValue) {
      const feeValue = parseFloat(form.brokerageFeeValue.replace(",", "."));
      payload.brokerageFeeType = form.brokerageFeeType;
      payload.brokerageFeeValue = feeValue;
      payload.brokerageFee =
        form.brokerageFeeType === "reais"
          ? feeValue
          : (feeValue / 100) * (btc * price);
    }

    await api.post("/transactions", payload);
    successMessage.value = "Transação inserida!";

    const month = form.date.substring(0, 7);
    store.setSelectedMonth(month);
    await store.fetchTransactions();

    // Reset
    Object.assign(form, {
      type: "compra",
      date: new Date().toISOString().split("T")[0],
      btcAmount: "",
      brlPricePerBtc: "",
      brokerageFeeType: "",
      brokerageFeeValue: "",
      calculateFee: true,
      notes: "",
    });
  } catch (err) {
    errorMessage.value = err.response?.data?.msg || "Erro ao inserir";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
