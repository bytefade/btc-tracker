<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Bitcoin Tracker</h1>
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Sair
        </button>
      </div>
      <TransactionForm />
      <TransactionList />
    </div>
  </div>
</template>
<script setup>
import TransactionForm from "./TransactionForm.vue";
import TransactionList from "./TransactionsList.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("apiKey");
  router.push("/login");
};
</script>
