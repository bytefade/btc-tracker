<template>
  <div class="container mx-auto p-4">
    <h2>Autenticação</h2>
    <button
      @click="generateKey"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Gerar Chave API
    </button>
    <input v-if="newKey" v-model="keyInput" placeholder="Cole a chave gerada" />
    <button v-if="newKey" @click="saveKey">Salvar Chave</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api, { setApiKey } from "../services/api";

const newKey = ref(false);
const keyInput = ref("");

const generateKey = async () => {
  try {
    const res = await api.get("/transactions/generate-key");
    keyInput.value = res.data.apiKey;
    newKey.value = true;
  } catch (err) {
    console.error(err);
  }
};

const saveKey = () => {
  setApiKey(keyInput.value);
  newKey.value = false;
  alert("Chave salva!");
};
</script>
