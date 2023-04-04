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
    <dlg-dynamic-form :style="{display:(chShowDlgFld)?'':'none'}"
        idForm="FORM_DLG_LIST_FIELD"
        :nuPosXInit="100"
        :nuPosYInit="1100"
        txTitle="Campo"
        :objFrom="objFieldList"
        @close="chShowDlgFld = false"
        @finalize="saveField"
    />
    <dlg-dynamic-form :style="{display:(chShowDlgBtn)?'':'none'}"
        idForm="FORM_DLG_LIST_BUTTON"
        :nuPosXInit="100"
        :nuPosYInit="1100"
        txTitle="Botón"
        :objFrom="objButtonList"
        @close="chShowDlgBtn = false"
        @finalize="saveButton"
    />
    <div class="PagListDesignerListLists">
        <DynamicList
            idList="LIST_D_LISTS"
            @row-selected="setSelectedList" 
        ></DynamicList>
    </div>

    <div id="appDetail" class="PagGenericToggle">
        <span class="fi-rr-angle-left" onclick="document.getElementById('app').scrollIntoView(true);"></span>
        <p>{{(idListSelect)?'Editar':'Nuevo'}}</p>
    </div>

    <div class="PagListDesignerForm">
        <b-tabs content-class="mt-3">
            <b-tab title="Lista" active>
                <DynamicForm 
                    idForm="FORM_D_LIST"
                    :objForm="objFormPag"
                    @save-list="saveList($event)"
                />
            </b-tab>
            <b-tab title="Campos" :disabled="(idListSelect)?false:true">
                <DynamicList
                    idList="LIST_D_LIST_FIELDS"
                    :initFilter="{fltCdList: idListSelect}"
                    @row-selected="showField"
                ></DynamicList>
            </b-tab>
            <b-tab title="Botones" :disabled="(idListSelect)?false:true">
                <DynamicList
                    idList="LIST_D_LIST_BUTTONS"
                    :initFilter="{fltCdList: idListSelect}"
                    @row-selected="showButton"
                ></DynamicList>
            </b-tab>
        </b-tabs>
        
    </div>
  </div>
</template>

<script>

import DlgDynamicForm from '../components/DlgDynamicForm.vue';
import DynamicForm from '../components/DynamicForm.vue';
import DynamicList from '../components/DynamicList.vue';
import SocketEmit from '../SocketEmit';

export default {
    components:{
        DynamicForm,
        DynamicList,
        DlgDynamicForm
    },
    data() {
        return {
            sEmit: new SocketEmit(this.$socket, this.sockets, 'PagListDesigner'),
            objFormPag: {},
            listLoad: false,
            idListSelect: null,
            serviceName: 'PagListDesigner',
            callBackDlg: null,
            objFieldList: {},
            objButtonList: {},
            chShowDlgFld: false,
            chShowDlgBtn: false
        }
    },
    watch: {
        idListSelect() {
            var cm = this;
            if (this.idListSelect){
                this.sEmit.emitCall("GetListInfo", this.idListSelect, function(response){
                    cm.objFormPag = response;
                });
            } else {
                cm.objFormPag = {};
            }
        }
    },
    methods:{
        saveButton(button){
            button.CdList = this.idListSelect;
            var cm = this;
            this.sEmit.emitCall('SaveButton', button, function(response){
                var msg = "Error en el guardado";
                if (response) {
                    msg = "Guardado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado del botón',
                    autoHideDelay: 5000,
                    appendToast: true
                });
            });
            this.chShowDlgBtn = false;
        },
        saveField(field){
            field.CdList = this.idListSelect;
            var cm = this;
            this.sEmit.emitCall('SaveField', field, function(response){
                var msg = "Error en el guardado";
                if (response) {
                    msg = "Guardado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado del campo',
                    autoHideDelay: 5000,
                    appendToast: true
                });
            });
            this.chShowDlgFld = false;
        },
        showField(row){
            var cm = this;
            cm.objFieldList = {};
            if (row.IdListField) {
                this.sEmit.emitCall('GetFieldInfo', row.IdListField, function(response){
                    cm.objFieldList = response;
                });
            }
            this.chShowDlgFld = true;
        },
        showButton(row){
            var cm = this;
            cm.objButtonList = {};
            if (row.IdListButton) {
                this.sEmit.emitCall('GetButtonInfo', row.IdListButton, function(response){
                    cm.objButtonList = response;
                });
            }
            this.chShowDlgBtn = true;
        },
        setSelectedList(row){
            if (row) {      
                this.idListSelect = row.IdList;
                document.getElementById("appDetail").scrollIntoView();
            }
        },
        saveList(lst){
            this.sEmit.emitCall("Save", lst, this.saveListResponse);
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

