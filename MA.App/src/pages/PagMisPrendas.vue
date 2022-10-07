<template>
    <div id="PagMisPrendas">
        <b-form-select v-model="idArmario" :options="listArmarios"></b-form-select>
        <b-jumbotron id="PagMisPrendasJumnotron" :header="objArmario.TxName" :lead="objArmario.TxDescription">
        </b-jumbotron>
        <listcards :list="listPrendas" key="IdPrenda"></listcards>
    </div>
</template>
<style scoped>
    #PagMisPrendas{
        width: 90vw;
        margin-left: 5vw;
    }
    #PagMisPrendasJumnotron{
        background-color: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    #PagMisPrendasCardsPrendas{
        float: left;
        margin-right: 5px;
    }
</style>
<script>
import tool from "../tools";
import listcards from "../components/ListCards.vue";

export default {
    components: {
        listcards
    },
    sockets: {
        PagMisPrendasGetListArmariosResponse(listArmarios){
            this.listArmarios = listArmarios;
            if (!this.idArmario){
                this.idArmario = this.listArmarios[0].value;
            }
        },
        PagMisPrendasGetInfoArmario(response){
            this.objArmario = response.objArmario;
        },
        PagMisPrendasGetInfoPrenda(response){
            this.listPrendas.push(response.ObjPrenda);
        }
    },
    data(){
        return {
            idArmario:null,
            txArmario:null,
            listPrendas:[],
            objArmario:{},
            listArmarios: []
        }
    },
    watch: {
        idArmario(newValue){
            if (newValue){
                this.listPrendas = [];
                this.$socket.emit('PagMisPrendasGetInfo', this.idArmario);
            }
        }
    },
    created(){
        this.$socket.emit('PagMisPrendasGetListArmarios');
    },
    async mounted(){
        var idArmario = tool.getParamsURL('idArmario');
        if (idArmario) {
            this.idArmario = idArmario;
        }
    }
}
</script>