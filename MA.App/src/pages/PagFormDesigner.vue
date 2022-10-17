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
} .PagFormDesignerForm {
    height: 100%;
}
</style>

<template>
  <div id="PagFormDesigner">
    <div class="PagFormDesignerTableForms">
        <b-table striped hover 
            :items="listForms" 
            @row-selected="formSelected" 
            selectable 
            select-mode="single"
        ></b-table>
    </div>

    <div class="PagFormDesignerToggle">
        <p>Formulario</p>
    </div>

    <div class="PagFormDesignerForm" id="PagFormDesignerForm">
        <DynamicForm 
            v-if="formSelect"
            :idForm="formSelect"
            :objForm="objFormPag"
            :adminMode="true"
        />
    </div>
  </div>
</template>

<script>

import DynamicForm from '../components/DynamicForm.vue';
export default {
    components:{
        DynamicForm
    },
    sockets:{
        PagFormDesignerGetListFormsResponse(listForms){
            this.listForms = listForms;
        }
    },
    data() {
        return {
            listForms: [],
            objFormPag: {},
            formSelect: null
        }
    },
    methods:{
        formSelected(row){
            this.formSelect = row[0].IdFormulario;
            if (row) {
                document.getElementById("PagFormDesignerForm").scrollIntoView();
            }
        }
    },
    mounted(){
        this.$socket.emit("PagFormDesignerGetListForms");
    }

}
</script>

