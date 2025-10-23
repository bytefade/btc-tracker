import axios from "axios";

const API_BASE = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE,
});

export const setApiKey = (apiKey) => {
  api.defaults.headers.common["x-api-key"] = apiKey;
};

// Interceptor erros 401/403 para redirecionar para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("apiKey");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
