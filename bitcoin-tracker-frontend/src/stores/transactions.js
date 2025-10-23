import { defineStore } from "pinia";
import api from "../services/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    summary: { monthlySales: 0, isExempt: true },
  }),
  actions: {
    async fetchTransactions(month) {
      try {
        console.log("Fetching transações com mês: ", month);
        const params = month ? { month } : {};
        const res = await api.get("/transactions", { params });
        this.transactions = res.data.transactions;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("Erro ao buscar transações: ", err.message);
      }
    },
  },
});
