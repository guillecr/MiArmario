<template>
    <div id="PagMisPrendas">
        <b-form-select v-model="idArmario" :options="listArmarios"></b-form-select>
        <b-jumbotron id="PagMisPrendasJumnotron" :header="objArmario.TxName" :lead="objArmario.TxDescription">
        </b-jumbotron>
        <b-card id="PagMisPrendasCardsPrendas" v-for="prenda in listPrendas" :key="prenda.IdPrenda"
            :title="prenda.TxName"
            :img-src="prenda.BiImg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
        >
            <b-card-text>
                Estado <b-badge>{{prenda.TxState}}</b-badge>
            </b-card-text>
        </b-card>
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
export default {
    sockets: {
        PagMisPrendasGetInfoResponse(response) {
            this.listPrendas = response.listPrendas;
            this.objArmario = response.objArmario;
        },
        PagMisPrendasGetListArmariosResponse(listArmarios){
            this.listArmarios = listArmarios;
            if (!this.idArmario){
                this.idArmario = this.listArmarios[0].value;
            }
        },
        PagMisPrendasGetInfoPrendaImgResponse(objImg){
            for (var index in this.listPrendas){
                var prenda = this.listPrendas[index];
                if (prenda.IdPrenda == objImg.IdPrenda){
                    prenda.BiImg = 'data:image/jpeg;base64, ' + objImg.BiImg;
                    this.$forceUpdate();
                    break;
                }
            }
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
                this.$socket.emit('PagMisPrendasGetInfo', this.idArmario);
                //this.$socket.emit('getPrendasByArmario', this.idArmario);
            }
        }
    },
    created(){
        this.$socket.emit('PagMisPrendasGetListArmarios');
    },
    methods:{
        test: function(){
            tool.getParamsURL('test');
        }
    },
    async mounted(){
        var idArmario = tool.getParamsURL('idArmario');
        if (idArmario) {
            this.idArmario = idArmario;
        }
    }
}
</script>