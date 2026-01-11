import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import TasksPage from "../pages/TasksPage.vue";
import ArchivedPage from "../pages/ArchivedPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/tasks",
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TasksPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/archived",
    name: "archived",
    component: ArchivedPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/tasks");
  } else {
    next();
  }
});

export default router;
