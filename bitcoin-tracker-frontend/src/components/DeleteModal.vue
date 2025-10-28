<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Confirmar Exclusão
      </h3>
      <p>
        Tem certeza que deseja excluir esta transação? Esta ação não pode ser
        desfeita.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="close"
          class="px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-200"
        >
          Cancelar
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
          :disabled="isDeleting"
        >
          {{ isDeleting ? "Excluindo..." : "Excluir" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// eslint-disable-next-line
defineProps({
  isOpen: Boolean,
});

// eslint-disable-next-line
const emit = defineEmits(["close", "confirm"]);

const isDeleting = ref(false);

const close = () => {
  if (!isDeleting.value) {
    emit("close");
  }
};

const confirm = async () => {
  isDeleting.value = true;
  try {
    await emit("confirm");
  } finally {
    isDeleting.value = false;
  }
};
</script>
