<template>
    <div id="MisPrendas">
        <b-form-select v-model="idArmario" :options="listArmarios"></b-form-select>
        <b-jumbotron id="MisPrendasJumnotron" :header="objArmario.TxName" :lead="objArmario.TxDescription">
        </b-jumbotron>
        <b-card id="MisPrendasCardsPrendas" v-for="prenda in listPrendas" :key="prenda.IdPrenda"
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
    #MisPrendas{
        width: 90vw;
        margin-left: 5vw;
    }
    #MisPrendasJumnotron{
        background-color: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    #MisPrendasCardsPrendas{
        float: left;
        margin-right: 5px;
    }
</style>
<script>
import tool from "../tools";
export default {
    sockets: {
        getPrendasByArmarioResponse(listPrendas) {
            this.listPrendas = listPrendas;
        },
        getArmarioResponse(objArmario){
            this.objArmario = objArmario;
        },
        getListArmariosResponse(listArmarios){
            this.listArmarios = listArmarios;
            if (!this.idArmario){
                this.idArmario = this.listArmarios[0].value;
            }
        },
        getPrendasByArmarioImgResponse(objImg){
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
                this.$socket.emit('getArmario', this.idArmario);
                this.$socket.emit('getPrendasByArmario', this.idArmario);
            }
        }
    },
    methods:{
        test: function(){
            tool.getParamsURL('test');
        }
    },
    async mounted(){
        // Establecer la sesión tarda mas que realizar la llamada
        await new Promise(resolve => setTimeout(resolve, 500))
        this.$socket.emit('getListArmarios');
        var idArmario = tool.getParamsURL('idArmario');
        if (idArmario) {
            this.idArmario = idArmario;
        }
    }
}
</script>