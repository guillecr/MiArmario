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
import tool from "./tools";
import Home from './pages/Home.vue';
import Init from './pages/Init.vue';
import Login from './pages/LogIn.vue';
import FormDPrendas from './pages/FormDPrendas.vue';
import PagMisPrendas from './pages/PagMisPrendas.vue';
import PagFormMisPrendas from './pages/PagFormMisPrendas.vue';
import PagFormDesigner from "./pages/PagFormDesigner.vue";

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
      console.log(this.$router.getRoutes());
      // TODO: La idea sería eliminar todos los existentes y añadir los obtenidos
      var pagesDisp = {
        'Home':Home,
        'Init':Init,
        'Login':Login,
        'FormDPrendas':FormDPrendas,
        'PagMisPrendas':PagMisPrendas,
        'PagFormMisPrendas':PagFormMisPrendas,
        'PagFormDesigner': PagFormDesigner
      }
      for (var i in ListPaginas){
        var pag = ListPaginas[i];
        console.log(pagesDisp[pag.CdComponent]);
        this.$router.addRoute({ 
          name: pag.CdName, 
          path: pag.TxPath, 
          component: pagesDisp[pag.CdComponent]}
        );
      }
      console.log(this.$router.getRoutes());
    },
    
    withAccess(access){
      // El servidor nos responde que tenemos acceso.
      // El mensaje lo obtenemos al iniciar la conexión, al iniciar sesión o cuando hagamos una llamada sin un token valido
      console.log("Acceso: " + access);
      if(!access){
        this.user = null;
        if (this.$route.name == 'login'){
          this.$bvToast.toast(`Usuario rechazado`, {
            title: 'Error',
            autoHideDelay: 5000,
            appendToast: true
          });
        }

        if (this.$route.name != 'login') {
          this.$router.push('/login');
        }        
      } else {
        this.user = access;
        if (this.$route.name == 'login'){
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
