<template>
    <div id="PagUsers">
        <dlg-dynamic-form :style="{display:(chShowDlgProfile)?'':'none'}"
            idForm="FORM_R_PROFILE_USER"
            :nuPosXInit="100"
            :nuPosYInit="1100"
            txTitle="Perfil"
            :objFrom="objProfile"
            @close="chShowDlgProfile = false"
            @finalize="saveProfile"
        />
      <div id="PagUsersList" class="PagGenericList">
          <dynamic-list
              idList="LIST_D_USERS"
              @row-selected="setSelected" 
          />
      </div>
  
      <div id="appDetail" class="PagGenericToggle">
          <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
          <p>{{(keySelected)?'Editar':'Nuevo'}}</p>
      </div>
  
      <div class="PagGenericForm">
        <b-tabs content-class="mt-3">
            <b-tab title="Usuario" active>
                <dynamic-form 
                    idForm="FORM_D_USERS"
                    :objForm="objSelected"
                    @save-entity="saveEntity"
                />
            </b-tab>
            <b-tab title="Perfiles">
                <DynamicList
                    idList="LIST_R_PROFILE_USER"
                    :initFilter="{fltCdUser: keySelected}"
                    @row-selected="showProfile"
                ></DynamicList>
            </b-tab>
            
        </b-tabs>
          
      </div>
    </div>
  
  </template>
  
  <script>
  import DynamicForm from '../components/DynamicForm.vue'
  import DynamicList from '../components/DynamicList.vue'
  import DlgDynamicForm from '../components/DlgDynamicForm.vue'
  import SocketEmit from '../SocketEmit'
  
  export default {
    components: { DynamicForm, DynamicList, DlgDynamicForm },
    data: function(){
      return {
          sEmit: new SocketEmit(this.$socket, this.sockets, 'PagUsers'),
          objSelected: {},
          objProfile: {},
          keySelected: null,
          chShowDlgProfile: false,
          serviceName: "PagUsers"
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
                        cm.$bvToast.toast("Se ha producido un error al obtener el Usuario", {
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
                this.keySelected = key.IdUser;
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
                title: 'Guardado del usuario',
                autoHideDelay: 5000,
                appendToast: true
            });
        },
        showProfile(row){
            this.objProfile = {
                CdProfile: row.CdProfile,
                CdUser: this.objSelected.IdUser,
                TxLogin: this.objSelected.TxLogin,
                IdProfilesUsers: row.IdProfilesUsers
            };
            this.chShowDlgProfile = true;
        },
        saveProfile(profile){
            var cm = this;
            this.sEmit.emitCall('SaveProfile', profile, function(response){
                var msg = "Error en el guardado";
                if (response) {
                    msg = "Guardado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado del perfil',
                    autoHideDelay: 5000,
                    appendToast: true
                });
            });
            this.chShowDlgProfile = false;
        },
    }
  
  }
  </script>
  
  <style>
  
  </style>