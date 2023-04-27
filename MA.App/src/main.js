import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from "./router";
import io from "socket.io-client";
import VueSocketIO from 'vue-socket.io';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import tool from "./tools";

const host = location.host.split(':')[0];
const urlServer = `https://${host}/miarmario/`;

// var connection = new VueSocketIO({
//   debug: true,
//   connection: io('http://192.168.0.16:3030',{ transports : ['websocket'] }), // transports es importante para CORS
// });
// var connection = new VueSocketIO({
//   debug: true,
//   connection: io(urlServer,{ transports : ['websocket'] }), // transports es importante para CORS
// });

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(new VueSocketIO({
  debug: true,
  connection: io(urlServer,{ 
    auth: (cb) => {
      cb({
        token:tool.getCookie('tokenAccess')
      });
    },
    transports : ['websocket']
  }), // transports es importante para CORS
}));
new Vue({
  router,
  render: function(h){
    VueRouter.To="/login";
    return h(App);
  }
}).$mount("#app");

