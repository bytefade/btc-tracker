import { defineStore } from "pinia";
import api from "../services/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    summary: { monthlySales: 0, isExempt: true },
    selectedMonth: new Date().toISOString().slice(0, 7), //Mês atual por padrão
  }),
  actions: {
    async fetchTransactions(month) {
      try {
        console.log("Fetching transações com mês: ", month);
        this.selectedMonth = month || this.selectedMonth;
        const params = this.selectedMonth ? { month: this.selectedMonth } : {};
        const res = await api.get("/transactions", { params });
        this.transactions = res.data.transactions;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("Erro ao buscar transações: ", err.message);
      }
    },
    setSelectedMonth(month) {
      this.selectedMonth = month;
    },
  },
});
