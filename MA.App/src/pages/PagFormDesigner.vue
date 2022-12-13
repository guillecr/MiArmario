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
            idList="LIST_PRUEBA"
            @row-selected="formSelected" 
        ></DynamicList>
    </div>

    <div class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>Formulario</p>
    </div>

    <div class="PagGenericForm" id="PagFormDesignerForm">
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
import DynamicList from '../components/DynamicList.vue';

export default {
    components:{
        DynamicForm,
        DynamicList
    },
    data() {
        return {
            defColumns: [],
            listForms: [],
            objFormPag: {},
            listLoad: false,
            formSelect: null
        }
    },
    methods:{
        formSelected(row){
            this.formSelect = row.IdForm;
            if (row) {
                document.getElementById("PagFormDesignerForm").scrollIntoView();
            }
        }
    }

}
</script>

