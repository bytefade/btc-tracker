<template>
  <div id="app" class="container mx-auto p-4">
    <LoginGeneral v-if="!hasApiKey" />
    <div v-else>
      <h1>Sistema Bitcoin Tracker</h1>
      <TransactionForm />
      <TransactionsList />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import LoginGeneral from "./components/LoginGeneral.vue";
import TransactionForm from "./components/TransactionForm.vue";
import TransactionsList from "./components/TransactionsList.vue";

// Expor como computed reativo
const hasApiKey = computed(() => !!localStorage.getItem("apiKey")); // !! converte para boolean (true se existe)
</script>
