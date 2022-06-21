import VueRouter from 'vue-router';
import Home from './pages/Home.vue';
import Init from './pages/Init.vue';
import Login from './pages/LogIn.vue';
import FormDPrendas from './pages/FormDPrendas.vue';
import MisPrendas from './pages/PagMisPrendas.vue';

const routes = [
  {
    path: "/",
    name: "init",
    component: Init
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;