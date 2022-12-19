<style>
.PagListDesignerToggle {
    margin: 2px;
    height: 50px;
    background-color: rgb(74, 144, 177);
}
.PagListDesignerToggle p {
    text-align: left;
    padding-top: 8px;
    padding-left: 8px;
    font-size: 25px;
    color:white;
}
.PagListDesignerListLists {
    height: 96%;
    padding: 8px;
}
.PagListDesignerForm {
    height: 100%;
}
</style>

<template>
  <div id="PagListDesigner">
    <div class="PagListDesignerListLists">
        <DynamicList
            idList="LIST_D_LISTS"
            @row-selected="setSelectedList" 
        ></DynamicList>
    </div>

    <div class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>{{(listSelect)?listSelect.TxName:'Nuevo'}}</p>
    </div>

    <div class="PagListDesignerForm" id="appDetail">
        <b-tabs content-class="mt-3">
            <b-tab title="Formulario" active>
                <DynamicForm 
                    v-if="true"
                    idForm="FORM_D_LIST"
                    :objForm="objFormPag"
                    @save-list="saveList($event)"
                />
            </b-tab>
            <b-tab title="Campos" v-if="listSelect">
                <DynamicList
                    idList="LIST_D_LIST_FIELDS"
                    :initFilter="{fltCdList: listSelect.IdList}"
                ></DynamicList>
            </b-tab>
        </b-tabs>
        
    </div>
  </div>
</template>

<script>

import DynamicForm from '../components/DynamicForm.vue';
import DynamicList from '../components/DynamicList.vue';
import tools from '../tools';

export default {
    components:{
        DynamicForm,
        DynamicList
    },
    data() {
        return {
            objFormPag: {},
            listLoad: false,
            listSelect: null,
            serviceName: 'PagListDesigner'
        }
    },
    sockets: {
        PagListDesigner_SaveResponse(response){
            console.log(response);
            var msg = "Error en el guardado";
            if (response) {
                msg = "Guardado correctamente"
            }
            this.$bvToast.toast(msg, {
                title: 'Guardado de lista',
                autoHideDelay: 5000,
                appendToast: true
            });
        }
    },
    methods:{
        setSelectedList(row){
            if (row && row.IdList) {      
                this.listSelect = row;
                var cm = this;
                tools.emitCall(this, "GetListInfo", this.listSelect.IdList, function(response){
                    cm.objFormPag = response;
                });
                if (row) {
                    document.getElementById("appDetail").scrollIntoView();
                }
            }
        },
        saveList(lst){
            var cm = this;
            tools.emitCall(this, "Save", lst, this.saveListResponse);
        },
        saveListResponse(response) {
            var msg = "Error en el guardado";
            if (response) {
                msg = "Guardado correctamente"
            }
            this.$bvToast.toast(msg, {
                title: 'Guardado de lista',
                autoHideDelay: 5000,
                appendToast: true
            });
        }
    }
}
</script>

