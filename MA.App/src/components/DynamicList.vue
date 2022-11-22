<template>
    <ListView
        :defColumns="defColumns"
        :objList="objList"
        @row-selected="rowSelected" 
        :selectable = "selectable"
    ></ListView>
</template>

<script>

import ListView from './ListView.vue';

export default {
    components:{
        ListView
    },
    data() {
        return {
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
    sockets: {
        DynamicListGetInfoResponse(response){
            this.defColumns = response.defColumns;
            this.selectable = response.selectable
        },
        DynamicListGetValuesResponse(response){
            this.objList = response;
        }
    },
    mounted(){
        this.$socket.emit("DynamicListGetInfo", this.idList);
        this.$socket.emit("DynamicListGetValues", this.idList);
    }

}
</script>