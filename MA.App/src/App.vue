<template>
  <div id="app" style="font-size: 14px;">
    <menu-lateral
      :version="version"
      :appName="appName"
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
      return JSON.stringify(require('../package.json').version).replace(/"/g,"");
    },
    appName: function(){
      return JSON.stringify(require('../package.json').namePublic).replace(/"/g,"");
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
          name: pag.TxName,
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
          this.$bvToast.toast(`Sin acceso`, {
            title: 'Login',
            autoHideDelay: 5000,
            appendToast: true
          });
        }
        //  else {
        //   this.$bvToast.toast(`Sesión caducada`, {
        //     title: 'Error',
        //     autoHideDelay: 5000,
        //     appendToast: true
        //   });
        // }

        if (this.$route.name != 'Login') {
          this.$router.push('/login');
        }
      } else {
        this.user = access;
        if (this.$route.name == 'Login'){
          this.$router.push('/init');
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
@import '../src/assets/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 54px;
  height: 100vh;
  padding-bottom: 30px;
}
#banConnect {
  position: fixed;
  bottom: 0;
  width: 100vw;
  /* right: 0;
  left: 0; */
  padding: 3px;
  padding-right: 25px;
  text-align: right;
  background-color: #2c3e50;
  color: white;
  z-index: 100;
}
.view {
  height: 100%;
}
</style>
