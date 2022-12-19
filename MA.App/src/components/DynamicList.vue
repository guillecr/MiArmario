<style>
    .DynamicListButton {
        padding-left: 5px !important;
        padding-right: 5px !important;
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
        ></ListView>
    </div>
</template>

<script>

import tools from '../tools';
import ListView from './ListView.vue';

export default {
    components:{
        ListView
    },
    data() {
        return {
            serviceName:'DynamicList',
            defColumns: [],
            defButtons:[],
            objList: [],
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
            tools.emitCall(this, "GetValues", {idList: this.idList, flt:this.initFilter}, function(response) {
                cm.objList = response;
            });
        }
    },
    mounted(){
        var cm = this;
        tools.emitCall(this, "GetInfo", this.idList, function(response) {
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