<template>
    <div id="PagPermissions" style="padding: 10px;">
        <!-- Lista de perfiles -->
        <b-form-select class="PagPermissionsListProfiles"
            type="text"
            :options="lstProfiles"
            size="sm"
            style="display: block; width:300px;"
            v-model="IdProfile">
            <template #first>
                <b-form-select-option :value="null" disabled>-- Seleccione un perfil --</b-form-select-option>
            </template>
        </b-form-select>
        <br>
        <!-- Botón de guardar -->
        <b-btn class="FormButtom"
            v-if="lstMenus_.length > 0"
            variant="success"
            style="display: block; width:100px;"
            @click="savePermissions()"
        >Guardar</b-btn>
        <br>
        <!-- Lista de menus -->
        <b-form-checkbox
            v-for="menu in lstMenus_" :key="menu.CdMenu"
            v-model="lstPermissions[menu.CdMenu]"
            style="text-align: left;"
        >{{ menu.TxName }}</b-form-checkbox>
    </div>
  </template>
  
  <script>
  import SocketEmit from '../SocketEmit'
  
  export default {
    //components: { DynamicForm, DynamicList, DlgDynamicForm },
    data: function(){
      return {
          sEmit: new SocketEmit(this.$socket, this.sockets, 'PagPermissions'),
          objSelected: {},
          IdProfile: null,
          chShowDlgProfile: false,
          lstProfiles:[],
          serviceName: "PagPermissions",
          lstMenus:[],
          lstPermissions:{}
      }
    },
    computed: {
        lstMenus_(){
            if (this.IdProfile){
                return this.lstMenus;
            }
            return [];
        }
    },
    watch: {
        IdProfile(key){
            this.lstPermissions = {};
            if (key) {
                var cm = this;
                this.sEmit.emitCall("GetPermissons", key, function(response) {
                    cm.lstPermissions = {};
                    if (response) {
                        for (var i = 0; i < response.length; i++){
                            var key = response[i];
                            cm.lstPermissions[key] = true;
                        }
                    } else {
                        cm.$bvToast.toast("Se ha producido un error al obtener los permisos", {
                            title: 'Mensaje de servidor',
                            autoHideDelay: 5000,
                            appendToast: true
                        });    
                    }
                })
            }
      }
    },
    methods: {
        getLstPermissions(){
            var result = [];
            var lstKeys = Object.keys(this.lstPermissions);
            for (var i = 0; i < lstKeys.length; i++){
                var key = lstKeys[i];
                if (this.lstPermissions[key]){
                    result.push(key);
                }
            }
            return result;
        },
        getMenus(){
            var cm = this;
            this.sEmit.emitCall("GetMenusInfo", null, function(response){
                cm.lstMenus = response;
            });
        },
        getProfiles(){
            var cm = this;
            this.sEmit.emitCall("GetProfilesInfo", null, function(response){
                cm.lstProfiles = response;
            });
        },
        savePermissions(){
            var cm = this;
            var request = {IdProfile: this.IdProfile, lstPermissions:this.getLstPermissions()}
            this.sEmit.emitCall("Save", request, function(response){
                var msg = "Error en el guardado";
                if (response) {
                    msg = "Guardado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado de permisos',
                    autoHideDelay: 5000,
                    appendToast: true
                });
            });
        }
    },
    mounted(){
        this.getProfiles();
        this.getMenus();
    }
  
  }
  </script>
  
  <style>
  
  </style>