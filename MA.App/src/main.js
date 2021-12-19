import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from "./router";
import VueSocketIO from 'vue-socket.io';
import io from "socket.io-client";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io('https://localhost:3000',{ transports : ['websocket'] }), // transports es importante para CORS
  })
);
Vue.use(VueRouter);

new Vue({
  router,
  render: function(h){
    VueRouter.To="/";
    return h(App);
  }
}).$mount("#app");

