<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Autenticação
      </h2>
      <div class="space-y-4">
        <div
          v-if="errorMessage"
          class="bg-red-100 text-red-700 p-3 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="bg-green-100 text-green-700 p-3 rounded-lg text-sm"
        >
          {{ successMessage }}
        </div>
        <button
          @click="generateKey"
          class="w-full bg-orange-50 hover:bg-orange-600 text-white font-meidum py-2 px-4 rounded-lg transtion duration-200"
        >
          Gerar Chave API
        </button>
        <div v-if="newKey" class="space-y-2">
          <input
            v-model="keyInput"
            placeholder="Cole a chave gerada"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus-ring-2 focus:ring-orange-500"
          />
          <button
            @click="saveKey"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transtion duration-200"
          >
            Salvar Chave
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api, { setApiKey } from "../services/api";

const router = useRouter();
const newKey = ref(false);
const keyInput = ref("");
const errorMessage = ref("");
const successMessage = ref("");

//Regex básico para validar formato JWT (header.payload.signature)
const isValidJwt = (token) => {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
};

const generateKey = async () => {
  try {
    const res = await api.get("/transactions/generate-key");
    keyInput.value = res.data.apiKey;
    newKey.value = true;
    errorMessage.value = "";
    successMessage.value = "Chave gerada com sucesso!";
  } catch (err) {
    errorMessage.value = "Erro ao gearar chave: " + err.message;
    successMessage.value = "";
  }
};

const saveKey = () => {
  if (!isValidJwt(keyInput.value)) {
    errorMessage.value = "Chave inválida! Deve ser um token JWT válido.";
    successMessage.value = "";
    return;
  }
  setApiKey(keyInput.value);
  localStorage.setItem("apiKey", keyInput.value);
  newKey.value = false;
  errorMessage.value = "";
  successMessage.value = "Chave salva! Redirecionando...";
  setTimeout(() => router.push("/dashboard"), 1000);
};
</script>
