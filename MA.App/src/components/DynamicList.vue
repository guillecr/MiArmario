<style>
    .DynamicListButton {
        padding-left: 8px !important;
        padding-right: 8px !important;
        margin-right: 5px;
        float: left;
    }
    .DynamicListLstButtons {
        margin: 8px;
        padding-left: 10px;
        height: 26px;
    }
</style>
<template>
    <div class="DynamicList">
        
        <div class="DynamicListLstButtons">
            <b-btn class="FormButtom DynamicListButton"
                variant="primary"
                style="padding-top: 4px !important;" 
                @click="refreshData"
            ><span class="fi-rr-refresh"></span></b-btn>
            <b-btn class="FormButtom DynamicListButton" v-for="btn in defButtons" 
                :key="btn.IdListButton"
                :variant="btn.CdVariant"
                @click="actionButton(btn)"
            >{{ btn.TxLabel }}</b-btn>
        </div>
        <ListView
            :defColumns="defColumns"
            :objList="objList"
            @row-selected="rowSelected" 
            :selectable = "selectable"
            :isBusy="isBusy"
        ></ListView>
    </div>
</template>

<script>

import ListView from './ListView.vue';
import SocketEmit from '../SocketEmit';

export default {
    components:{
        ListView
    },
    data() {
        return {
            sEmit: new SocketEmit(this.$socket, this.sockets, 'DynamicList'),
            serviceName:'DynamicList',
            defColumns: [],
            defButtons:[],
            objList: [],
            isBusy: false,
            selectable: true            
        }
    },
    props: {
        idList: String,
        initFilter: Object
    },
    watch:{
        initFilter: function(){
            this.refreshData();
        }
    },
    methods: {
        rowSelected(row){
            this.$emit('row-selected', row);
        },
        actionButton(btn){
            this.calcEval(btn.TxAction);
        },
        calcEval: function(exp) {
            var frm = this.objForm;
            var cm = this;
            return eval(exp);
        },
        refreshData(){
            var cm = this;
            this.sEmit.emitCall("GetValues", {idList: this.idList, flt:this.initFilter}, function(response) {
                cm.objList = response;
            });
        }
    },
    mounted(){
        var cm = this;
        this.isBusy = true;
        this.sEmit.emitCall("GetInfo", this.idList, function(response) {
            cm.isBusy = false;
            cm.defColumns = response.defColumns;
            cm.selectable = response.selectable;
            cm.defButtons = response.defButtons;
        });
        this.refreshData();
        // tools.emitCall(this, "GetValues", {idList: this.idList, flt:this.initFilter}, function(response) {
        //     cm.objList = response;
        // });
    }

}
</script>