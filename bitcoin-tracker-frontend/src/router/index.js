import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/LoginGeneral.vue";
import Dashboard from "../components/DashboardGeneral.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const apiKey = localStorage.getItem("apiKey");
  if (to.meta.requiresAuth && !apiKey) {
    next("/login");
  } else {
    next();
  }
});

export default router;
