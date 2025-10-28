import axios from "axios";

const PORT = process.env.API_PORT || 5001;
const API_BASE = process.env.API_BASE || `http://localhost:${PORT}/api`;

const api = axios.create({
  baseURL: API_BASE,
});

//Configura token do localStorage no carregamento
const token = localStorage.getItem("apiKey");
if (token) {
  api.defaults.headers.common["x-api-key"] = token;
  console.log("Token carregado do localStorage: ", token);
}

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
