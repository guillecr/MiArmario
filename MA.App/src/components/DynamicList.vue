<style>
    .DynamicList {
        height: 100%;
    }
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
    .DynamicListFilters {
        margin: 8px;
        padding-left: 10px;
        height: 26px;
    }
    .DynamicListFiltersElementLabel {
        text-align: left;
        margin-right: 10px;
    }
    .DynamicListFiltersElementText {
        height: 26px;
        display: initial;
        padding-left: 10px;
        font-size: 14px;
        margin-right: 15px;  
    }

</style>
<template>
    <div class="DynamicList">
        
        <div class="DynamicListLstButtons">
            <b-btn class="FormButtom DynamicListButton"
                variant="outline-primary"
                style="padding-top: 4px !important;width: 32px;" 
                @click="refreshData"
            ><span class="fi-rr-refresh"></span></b-btn>
            <b-btn class="FormButtom DynamicListButton" v-for="btn in defButtons" 
                :key="btn.IdListButton"
                :variant="(btn.CdVariant)? 'outline-' + btn.CdVariant:''"
                @click="actionButton(btn)"
            >{{ btn.TxLabel }}</b-btn>
        </div>
        <div class="DynamicListFilters" v-if="defFilters_.length > 0">
            <label class="DynamicListFiltersElement" v-for="flt in defFilters_" :key="flt.IdListField" style="float: left;"
                ><label class="DynamicListFiltersElementLabel">{{ flt.TxLabel }}</label>
                <b-form-input class="DynamicListFiltersElementText"
                    type="text"
                    :style="{width:'150px'}"
                    v-model="filtersValue[flt.CdFilterName]"/>
            </label>
        </div>
        <ListView
            :style="{height: (defFilters_.length == 0)?'95%':'90%'}"
            :defColumns="defColumns_"
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
            selectable: true,
            filtersValue:{}        
        }
    },
    props: {
        idList: String,
        initFilter: Object
    },
    computed: {
        defFilters_(){
            var lstResult = [];
            var lst = this.defColumns;
            if (lst && lst.length){
                for(var i = 0; i < lst.length; i++){
                    if (lst[i].CdFilterName) {
                        lstResult.push(lst[i]);
                    }
                }
            }
            return lstResult;
        },
        defColumns_(){
            var lstResult = [];
            var lst = this.defColumns;
            if (lst && lst.length){
                for(var i = 0; i < lst.length; i++){
                    var def = lst[i];
                    lstResult.push({
                        key: def.CdFieldName,
                        label: def.TxLabel,
                        thStyle: def.TxStyle,
                        sortable: def.ChSortable,
                        variant: def.CdVariant
                    });
                }
            }
            return lstResult;
        }
    },
    watch:{
        initFilter: function(){
            var keys = Object.keys(this.initFilter);
            for (var i = 0; i < keys.length; i++){
                var key = keys[i];
                this.filtersValue[key] = this.initFilter[key];
            }
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
            this.sEmit.emitCall("GetValues", {idList: this.idList, flt:this.filtersValue}, function(response) {
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