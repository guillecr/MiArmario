<template>
    <div id="PagChangePw">  
      <div class="PagGenericForm" id="appDetail">
          <dynamic-form 
              idForm="FORM_CHANGE_PW"
              :objForm="objForm"
              @change-pw="changePw"
          />
      </div>
    </div>
  
  </template>
  <script>
  import DynamicForm from '../components/DynamicForm.vue'
  import SocketEmit from '../SocketEmit'
  
  export default {
    components: { DynamicForm },
    data: function(){
      return {
          sEmit: new SocketEmit(this.$socket, this.sockets, 'PagChangePw'),
          objForm:{},
          serviceName: "PagChangePw"
      }
    },
    methods: {
      changePw(){
          this.sEmit.emitCall("ChangePw", this.objForm, this.changePwResponse);
      },
      changePwResponse(response) {
          var msg = "Error en el cambio";
          if (response) {
              msg = "Cambio correctamente"
          }
          this.$bvToast.toast(msg, {
              title: 'Cambio de contraseña',
              autoHideDelay: 5000,
              appendToast: true
          });
      }
    }
  
  }
  </script>
  
  <style>
  
  </style>