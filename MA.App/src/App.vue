<template>
  <div id="app">
    <menu-lateral 
      :version="version"
    ></menu-lateral>
    <router-view class="view"></router-view>
    <div id="banConnect">
      {{usuario}}
    </div>
  </div>
</template>

<script>
import MenuLateral from "./components/MenuLateral.vue";
export default {
  name: 'App',
  components: {
    MenuLateral
  },
  data(){
    return{
      isConnected: false,
      user: null
    }
  },
  computed:{
    version: function(){
      return JSON.stringify(require('../package-lock.json').version).replace(/"/g,"");
    },
    conectado: function(){
      return this.isConnected? 'Conectado':'Desconectado'
    },
    usuario: function(){
      if (!this.isConnected) {
        return 'Desconectado';
      } else {
        return 'Usuario: ' + (this.user? this.user : 'No login');
      }
    }
   },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      this.$socket.emit('getMenus');
      var coo = document.cookie.substring(12);
      if (coo){
        this.$socket.emit('getSession',{token: coo});
      }
    },

    disconnect() {
      this.isConnected = false;
    },
    token(CdToken){
      document.cookie = "tokenAccess=" + CdToken;
    },
    withAccess(access){
      console.log("Acceso: " + access);
      if(!access){
        this.user = null;
        this.$bvToast.toast(`Usuario rechazado`, {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: true
        });
        
        if (window.location.pathname != '/login') {
          this.$router.replace('/login');
        }        
      } else {
        this.user = access;
        if (window.location.pathname != '/' && window.location.pathname != ''){
          this.$router.replace('/');
        }
      }
      this.$socket.emit('getMenus');
      
    },

    // Si el servidor nos contesta con la cabecera "mensaje"
    mensaje(data) {
      this.socketMessage = data
    }
  }
}
</script>

<style>
@import '../src/assets/icons_uicons/css/uicons-regular-rounded.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#banConnect {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #2c3e50;
  left: 0;
  text-align: right;
  color: white;
  padding: 3px;
  padding-right: 7px;
  z-index: 10;
}
</style>
