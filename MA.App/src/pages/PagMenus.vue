<template>
  <div id="PagMenus">
    <div id="PagMenusList" class="PagGenericList">
        <dynamic-list
            idList="LIST_D_MENUS"
            @row-selected="setSelected" 
        />
    </div>

    <div id="PagMenusList" class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>{{(keySelected)?'Editar':'Nuevo'}}</p>
    </div>

    <div class="PagGenericForm" id="appDetail">
        <dynamic-form 
            v-if="true"
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
import tools from '../tools'

export default {
  components: { DynamicForm, DynamicList },
  data: function(){
    return {
        objSelected:{},
        keySelected: null,
        serviceName: "PagMenus"
    }
  },
  watch: {
    keySelected(key){
        if (key) {
            var cm = this;
            tools.emitCall(this, "GetInfo", key, function(request) {
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
        }
    }
  },
  methods: {
    setSelected(key){
        if (key && key.IdMenu){
            this.keySelected = key.IdMenu;
            document.getElementById("appDetail").scrollIntoView();
        }
    },
    saveMenu(){
        tools.emitCall(this, "Save", this.objSelected, this.saveMenuResponse);
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