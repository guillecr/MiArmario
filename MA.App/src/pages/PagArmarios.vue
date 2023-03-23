<template>
    <div id="PagArmarios">
      <div id="PagArmariosList" class="PagGenericList">
          <dynamic-list
              idList="LIST_D_CLOSETS"
              @row-selected="setSelected" 
          />
      </div>
  
      <div id="PagArmariosList" class="PagGenericToggle">
          <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
          <p>{{(keySelected)?'Editar':'Nuevo'}}</p>
      </div>
  
      <div class="PagGenericForm" id="appDetail">
        <b-tabs content-class="mt-3">
            <b-tab title="Usuario" active>
                <dynamic-form 
                    idForm="FORM_D_CLOSET"
                    :objForm="objSelected"
                    @save-entity="saveEntity"
                />
            </b-tab>            
        </b-tabs>
          
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
          sEmit: new SocketEmit(this.$socket, this.sockets, 'PagArmarios'),
          objSelected: {},
          keySelected: null,
          serviceName: "PagArmarios"
      }
    },
    watch: {
        keySelected(key){
            if (key) {
                var cm = this;
                console.log(key);
                this.sEmit.emitCall("GetInfo", key, function(request) {
                    if (request) {
                        cm.objSelected = request;
                    } else {
                        cm.$bvToast.toast("Se ha producido un error al obtener el armario", {
                            title: 'Mensaje de servidor',
                            autoHideDelay: 5000,
                            appendToast: true
                        });
                        cm.objSelected = {};
                    }
                });
            } else {
                // Caso de nuevo
                this.objSelected = {};
            }
        }
    },
    methods: {
        setSelected(key){
            if (key){
                this.keySelected = key.IdCloset;
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
                title: 'Guardado del armario',
                autoHideDelay: 5000,
                appendToast: true
            });
        }
    }
  }
  </script>
  
  <style>
  
  </style>