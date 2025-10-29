import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || "/api",
});

//Intercepta TODAS as requisições
api.interceptors.request.use((config) => {
  const key = localStorage.getItem("apiKey");
  if (key) {
    config.headers["x-api-key"] = key;
  }
  return config;
});

// Redireciona em casao de 401/403
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
