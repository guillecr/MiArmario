<style>
.PagFormDesignerToggle {
    margin: 2px;
    height: 50px;
    background-color: rgb(74, 144, 177);
}
.PagFormDesignerToggle p {
    text-align: left;
    padding-top: 8px;
    padding-left: 8px;
    font-size: 25px;
    color:white;
}
.PagFormDesignerTableForms {
    height: 96%;
    padding: 8px;
} 
.PagFormDesignerForm {
    height: 100%;
}
</style>

<template>
  <div id="PagFormDesigner">
    <div  class="PagGenericList">
        <DynamicList
            idList="LIST_D_FORMS"
            @row-selected="formSelected" 
        ></DynamicList>
    </div>

    <div class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>Formulario</p>
    </div>

    <div class="PagGenericForm" id="PagFormDesignerForm">
        <b-tabs content-class="mt-3">
            <b-tab title="Formulario" active>
                <DynamicForm
                    idForm="FORM_D_FORMS"
                    :objForm="objFormFoms"
                    @save-form="saveForm"
                />
            </b-tab>
            <b-tab title="Diseño" :disabled="(idFormSelect)?false:true">
                <DynamicForm 
                    :idForm="idFormSelect"
                    :objForm="objFormStructure"
                    :adminMode="true"
                />
            </b-tab>
        </b-tabs>
    </div>
  </div>
</template>

<script>

import DynamicForm from '../components/DynamicForm.vue';
import DynamicList from '../components/DynamicList.vue';
import SocketEmit from '../SocketEmit';

export default {
    components:{
        DynamicForm,
        DynamicList
    },
    data() {
        return {
            sEmit: new SocketEmit(this.$socket, this.sockets, 'PagFormDesigner'),
            serviceName:"PagFormDesigner",
            defColumns: [],
            listForms: [],
            objFormFoms: {},
            objFormStructure: {},
            idFormSelect: null
        }
    },
    methods:{
        saveForm(frm){
            this.sEmit.emitCall("Save", frm, this.saveFormResponse);
        },
        saveFormResponse(response) {
            var msg = "Error en el guardado";
            if (response) {
                msg = "Guardado correctamente"
            }
            this.$bvToast.toast(msg, {
                title: 'Guardado del formulario',
                autoHideDelay: 5000,
                appendToast: true
            });
        },
        formSelected(row){
            this.idFormSelect = row.IdForm;
            var cm = this;
            if (this.idFormSelect) {
                this.sEmit.emitCall("GetInfo", this.idFormSelect, function(response) {
                    cm.objFormFoms = response;
                });
            } else {
                cm.objFormFoms = row;
            }
            document.getElementById("PagFormDesignerForm").scrollIntoView();
        }
    }

}
</script>

