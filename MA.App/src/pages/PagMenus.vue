<template>
  <div id="PagMenus">
    <div id="PagMenusList" class="PagGenericList">
        <dynamic-list
            idList="LIST_D_MENUS"
            @row-selected="setSelected" 
        />
    </div>

    <div id="appDetail" class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>{{(keySelected)?'Editar':'Nuevo'}}</p>
    </div>

    <div class="PagGenericForm">
        <dynamic-form 
            idForm="FORM_D_MENUS"
            :objForm="objSelected"
            @save-menu="saveMenu"
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
        sEmit: new SocketEmit(this.$socket, this.sockets, 'PagMenus'),
        objSelected:{},
        keySelected: null,
        serviceName: "PagMenus"
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
                    cm.$bvToast.toast("Se ha producido un error al obtener el menú", {
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
            this.keySelected = key.CdComponent;
            document.getElementById("appDetail").scrollIntoView();
        }
    },
    saveMenu(){
        this.sEmit.emitCall("Save", this.objSelected, this.saveMenuResponse);
    },
    saveMenuResponse(response) {
        var msg = "Error en el guardado";
        if (response) {
            msg = "Guardado correctamente"
        }
        this.$bvToast.toast(msg, {
            title: 'Guardado del menú',
            autoHideDelay: 5000,
            appendToast: true
        });
    }
  }

}
</script>

<style>

</style>