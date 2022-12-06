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

    <div class="PagListDesignerToggle">
        <p>{{(listSelect)?listSelect.TxName:'Nuevo'}}</p>
    </div>

    <div class="PagListDesignerForm" id="appDetail">
        <DynamicForm 
            v-if="true"
            idForm="FORM_D_LIST"
            :objForm="objFormPag"
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
            objFormPag: {},
            listLoad: false,
            listSelect: null
        }
    },
    sockets: {
        PagListDesignerGetListInfoResponse(data){
            this.objFormPag = data;
        }
    },
    methods:{
        setSelectedList(row){
            if (row && row.IdList) {      
                this.listSelect = row;
                this.$socket.emit("PagListDesignerGetListInfo", this.listSelect.IdList);
                if (row) {
                    document.getElementById("appDetail").scrollIntoView();
                }
            }
        }
    }

}
</script>

