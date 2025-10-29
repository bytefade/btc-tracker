<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4"
  >
    <div class="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Autenticação
      </h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Chave Privada</label
          >
          <input
            v-model="apiKey"
            type="password"
            placeholder="Digite sua chave privada"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          :disabled="isLoading"
        >
          {{ isLoading ? "Validando..." : "Entrar" }}
        </button>
      </form>
      <div
        v-if="error"
        class="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        class="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm"
      >
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const apiKey = ref("");
const isLoading = ref(false);
const router = useRouter();
const error = ref("");
const success = ref("");

const login = async () => {
  isLoading.value = true;
  error.value = "";
  success.value = "";

  try {
    const res = await api.post("/auth/login", { key: apiKey.value });

    localStorage.setItem("apiKey", res.data.key);

    success.value = "Login bem-sucedido! Redirecionando...";

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } catch (err) {
    error.value = err.response?.data?.msg || "Erro ao fazer login";
  } finally {
    isLoading.value = false;
  }
};
</script>
