import axios from "axios";

const API_BASE = "http://localhost:5001/api";
let apiKey = localStorage.getItem("apiKey");

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para adicionar chave
api.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

export const setApiKey = (key) => {
  apiKey = key;
  localStorage.setItem("apiKey", key);
};

export default api;
