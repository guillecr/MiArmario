<template>
    <div id="PagGestionLiterales">
      <div id="PagGestionLiteralesList" class="PagGenericList">
          <dynamic-list
              idList="LIST_P_LITERAL_VALUES"
              @row-selected="setSelected" 
          />
      </div>
  
      <div id="PagGestionLiteralesList" class="PagGenericToggle">
          <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
          <p>{{(keySelected)?'Editar':'Nuevo'}}</p>
      </div>
  
      <div class="PagGenericForm" id="appDetail">
          <dynamic-form 
              idForm="FORM_P_LITERAL_VALUES"
              :objForm="objSelected"
              @save-entity="saveEntity"
          />
      </div>
    </div>
  
  </template>
  
  <script>
  import DynamicForm from '../components/DynamicForm.vue'
  import DynamicList from '../components/DynamicList.vue'
  import SocketEmit from '../SocketEmit'
  
  export default {
    components: { DynamicForm, DynamicList },
    data: function(){
      return {
          sEmit: new SocketEmit(this.$socket, this.sockets, 'PagGestionLiterales'),
          objSelected:{},
          keySelected: null,
          serviceName: "PagGestionLiterales"
      }
    },
    watch: {
      keySelected(key){
          if (key) {
              var cm = this;
              this.sEmit.emitCall("GetInfo", key, function(request) {
                  if (request) {
                      cm.objSelected = request;
                  } else {
                      cm.$bvToast.toast("Se ha producido un error al obtener el literal", {
                          title: 'Mensaje de servidor',
                          autoHideDelay: 5000,
                          appendToast: true
                      });
                      cm.objSelected = {};
                  }
              })
          } else {
              // Caso de nuevo
              this.objSelected = {};
          }
      }
    },
    methods: {
      setSelected(key){
          if (key){
              this.keySelected = key.IdLiteralValue;
              document.getElementById("appDetail").scrollIntoView();
          }
      },
      saveEntity(){
          this.sEmit.emitCall("Save", this.objSelected, this.saveEntityResponse);
      },
      saveEntityResponse(response) {
          var msg = "Error en el guardado";
          if (response) {
              msg = "Guardado correctamente"
          }
          this.$bvToast.toast(msg, {
              title: 'Guardado del literal',
              autoHideDelay: 5000,
              appendToast: true
          });
      }
    }
  
  }
  </script>
  
  <style>
  
  </style>