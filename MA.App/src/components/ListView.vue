<template>
    <div class="ListView">
        <b-table 
            class="mt-3"
            :items="listItems" 
            :fields="listFields"
            :selectable="selectable"
            :select-mode="selectMode"
            :busy="isBusy"
            striped
            responsive
            hover
            sticky-header
            style="max-height: 100%;"
            @row-selected="rowSelected">
            <template #table-busy>
                <div class="text-center my-2">
                    <b-spinner class="align-middle" style="margin-right: 5px;"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>
  </div>
</template>

<script>

export default {
    props: {
        defColumns: Array,
        objList: Array,
        selectable: {
            type: Boolean,
            default: true
        },
        selectMode: {
            type: String,
            default: "single"
        },
        isBusy: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        listFields() {
            return this.defColumns || []
        },
        listItems() {
            var result = [];
            for(var i = 0; i < this.objList.length; i++){
                var elm = this.objList[i];
                var row = {};
                row.RowId = i;
                for(var indx in this.defColumns){
                    var key = this.defColumns[indx].key;
                    row[key] = this.calValue(key, elm);
                }
                result.push(row);
            }
            return result;
        } 
    },
    methods: {
        calValue: function(exp, elm){
            var frm = elm;
            var cm = this;
            return eval(exp);
        },
        calcEval: function(exp){
            var frm = this.objList;
            var cm = this;
            return eval(exp);
        },
        rowSelected: function(row){
            // TODO: No pensado para múltiples filas
            if (this.objList && row[0] && this.objList[row[0].RowId]){
                this.$emit('row-selected', this.objList[row[0].RowId]);
            }
        }
    }
}
</script>