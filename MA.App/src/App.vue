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
      user: null,
      listPages: {}
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
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    token(CdToken){
      // Al iniciar sesión correctamente, obtendremos la llamada token con el tokem generado
      // La cookie solo tendrá utilidad al reconectar con el servidor, evitando al usuario a acreditarse de nuevo.
      document.cookie = "tokenAccess=" + CdToken;
    },

    Menus(ListPaginas){
      for (var i in ListPaginas){
        var pag = ListPaginas[i];
        this.$router.addRoute({
          name: pag.CdComponent,
          path: pag.TxPath,
          component: require(`./pages/${pag.CdComponent}`).default}
        );
      }
    },

    withAccess(access){
      // El servidor nos responde que tenemos acceso.
      // El mensaje lo obtenemos al iniciar la conexión, al iniciar sesión o cuando hagamos una llamada sin un token valido
      if(!access){
        this.user = null;
        if (this.$route.name == 'Login'){
          this.$bvToast.toast(`Usuario rechazado`, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: true
          });
        }

        if (this.$route.name != 'Login') {
          this.$router.push('/login');
        }
      } else {
        this.user = access;
        if (this.$route.name == 'Login'){
          this.$router.push('/');
        }
      }
      this.$socket.emit('getMenus');

    },
    mensaje(data) {
      // TEST
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
  padding-top: 60px;
  height: 100vh;
}
#banConnect {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #2c3e50;
  left: 0;
  text-align: right;
  color: white;
  padding: 3px;
  padding-right: 7px;
  z-index: 100;
}
.view {
  height: 100%;
}
</style>
