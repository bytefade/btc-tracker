import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/LoginGeneral.vue";
import Dashboard from "../components/DashboardGeneral.vue";

//Regex básico para validar formato JWT
const isValidJwtFormat = (token) => {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
};

const routes = [
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("apiKey");
      return token && isValidJwtFormat(token) ? "/dashboard" : "/login";
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("apiKey");
      if (!token || !isValidJwtFormat) {
        next("/login");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//Validação global antes de cada rota
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("apiKey");
  const isAuthenticated = token && isValidJwtFormat(token);

  if (to.path === "/login" && isAuthenticated) {
    next("/dashboard"); //Se logado, não permite acessar login
  } else if (to.path !== "/login" && !isAuthenticated) {
    next("/login"); //Se não logado, força login
  } else {
    next();
  }
});

export default router;
