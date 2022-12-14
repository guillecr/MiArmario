<template>
    <ListView
        :defColumns="defColumns"
        :objList="objList"
        @row-selected="rowSelected" 
        :selectable = "selectable"
    ></ListView>
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
            objList: [],
            selectable: true
        }
    },
    props: {
        idList: String
    },
    methods: {
        rowSelected(row){
            this.$emit('row-selected', row);
        }
    },
    mounted(){
        var cm = this;
        tools.emitCall(this, "GetInfo", this.idList, function(response) {
            cm.defColumns = response.defColumns;
            cm.selectable = response.selectable
        });
        tools.emitCall(this, "GetValues", this.idList, function(response) {
            cm.objList = response;
        });
    }

}
</script>