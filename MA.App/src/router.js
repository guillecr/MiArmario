import VueRouter from 'vue-router';
import Init from './pages/Init.vue';
import Login from './pages/Login.vue';

// Páginas visibles sin permisos
const routes = [
  {
    path: "/",
    name: "Init",
    component: Init
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;