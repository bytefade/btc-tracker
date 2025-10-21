import { defineStore } from "pinia";
import api from "../services/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    summary: {},
  }),
  actions: {
    async fetchTransactions(month) {
      console.log(month);
      try {
        const res = await api.get(`transactions?month=${month}`);
        this.transactions = res.data.transactions;
        this.summary = res.data.summary;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
