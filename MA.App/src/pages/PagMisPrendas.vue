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
import tools from "../tools";

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
        },
        PagMisPrendasGetInfoPrendaAllResponse(response){
            console.log(response);
        }
    },
    data(){
        return {
            idArmario:null,
            txArmario:null,
            listPrendas:[],
            objArmario:{},
            listArmarios: [],
            serviceName:"PagMisPrendas"
        }
    },
    watch: {
        idArmario(newValue){
            if (newValue){
                this.listPrendas = [];
                var cm = this;
                tool.emitCall(this, 'GetInfo', this.idArmario, function(response){
                    cm.objArmario = response.objArmario;
                    cm.listPrendas = response.lstPrenda;
                });
            }
        }
    },
    created(){
        var cm = this;
        tools.emitCall(this, 'GetListArmarios', null, function(request){
            cm.listArmarios = request;
            if (!cm.idArmario){
                cm.idArmario = cm.listArmarios[0].value;
            }
        });
    },
    async mounted(){
        var idArmario = tool.getParamsURL('idArmario');
        if (idArmario) {
            this.idArmario = idArmario;
        }
    }
}
</script>