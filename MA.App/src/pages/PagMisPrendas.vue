<template>
    <div id="PagMisPrendas">
        <dlg-dynamic-form :style="{display:(chShowDlgClothes)?'':'none'}"
            idForm="FORM_CLOTHES_EDIT"
            :nuPosXInit="nuDlgPosX"
            :nuPosYInit="nuDlgPosY"
            txTitle="Prenda"
            :objFrom="objSelectClothes"
            @close="chShowDlgClothes = false"
            @delete="deleteClothes"
            @finalize="saveClothes"
        />
        <div class="PagMisPrendasListArmarios">
            Mis armarios
            <b-list-group>
                <b-list-group-item v-for="elm in listArmarios" :key="elm.value"
                    @click="idArmario=elm.value" 
                    :active="elm.value == idArmario">{{elm.text}}
                </b-list-group-item>
            </b-list-group>
        </div>
        <b-jumbotron id="PagMisPrendasJumnotron" 
            :header="objArmario.TxName" 
            :lead="objArmario.TxDescription">
        </b-jumbotron>
        <listcards class="PagMisPrendasListPrendas"
            :list="listPrendas"
            nameNew="Añadir"
            Cdkey="IdPrenda"
            @row-selected="showClothes">
        </listcards>
    </div>
</template>
<style scoped>
    /* #PagMisPrendas{
        width: 90vw;
        margin-left: 5vw;
    } */
    .PagMisPrendasListPrendas{
        margin-left: 220px;
    }
    #PagMisPrendasJumnotron{
        background-color: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    /* #PagMisPrendasCardsPrendas{
        float: left;
        margin-right: 5px;
    } */
    .PagMisPrendasListArmarios{
        position: relative;
        top:5px;
        left: 0;
        width: 200px;
        padding: 10px;
        float: left;

    }
</style>
<script>
import tools from "../tools";
import listcards from "../components/ListCards.vue";
import SocketEmit from "../SocketEmit";
import DlgDynamicForm from '../components/DlgDynamicForm.vue';

export default {
    components: {
        listcards,
        DlgDynamicForm
    },
    data(){
        return {
            sEmit: new SocketEmit(this.$socket, this.sockets, 'PagMisPrendas'),
            idArmario:null,
            txArmario:null,
            listPrendas:[],
            objArmario:{},
            listArmarios: [],
            chShowDlgClothes: false,
            objSelectClothes: {},
            serviceName:"PagMisPrendas",
            nuDlgPosX: 100,
            nuDlgPosY: 100
        }
    },
    watch: {
        idArmario(newValue){
            if (newValue){
                this.listPrendas = [];
                var cm = this;
                this.sEmit.emitCall( 'GetInfo', this.idArmario, function(response){
                    cm.objArmario = response.objArmario;
                    //response.lstPrenda.push({TxName:'Nuevo'});
                    cm.listPrendas = response.lstPrenda;
                });
            }
        }
    },
    methods:{
        deleteClothes(IdPrenda){
            var cm = this;
            this.sEmit.emitCall('DeletePrenda', IdPrenda, function(response){
                var msg = "Error en el eliminado";
                if (response) {
                    msg = "Eliminado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Eliminar ropa',
                    autoHideDelay: 5000,
                    appendToast: true
                });

                cm.objSelectClothes = {};
                cm.chShowDlgClothes = false;
                cm.refreshClothes();
            });
        },
        showClothes(event){
            var row = event.row;
            this.nuDlgPosX = event.event.pageX;
            this.nuDlgPosY = event.event.pageY;
            var cm = this;
            if (row.IdPrenda) {
                // Editar prenda
                this.sEmit.emitCall('GetInfoPrenda', row.IdPrenda, function(response){
                    if (response) {
                        cm.objSelectClothes = response;
                        cm.chShowDlgClothes = true;
                    }
                });
            } else {
                cm.objSelectClothes = {};
                cm.chShowDlgClothes = true;
            }
        },
        saveClothes(frm){
            var cm = this;
            this.sEmit.emitCall('SavePrenda', frm, function(response){
                var msg = "Error en el guardado";
                if (response) {
                    msg = "Guardado correctamente"
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado de ropa',
                    autoHideDelay: 5000,
                    appendToast: true
                });

                cm.objSelectClothes = {};
                cm.chShowDlgClothes = false;
                cm.refreshClothes();
            });
        },
        refreshClothes(){
            var cm = this;
            this.sEmit.emitCall( 'GetInfo', this.idArmario, function(response){
                cm.objArmario = response.objArmario;
                cm.listPrendas = response.lstPrenda;
            });
        }
    },
    created(){
        var cm = this;
        this.sEmit.emitCall('GetListArmarios', null, function(request){
            cm.listArmarios = request;
            if (!cm.idArmario){
                cm.idArmario = cm.listArmarios[0].value;
            }
        });
    },
    mounted(){
        var idArmario = tools.getParamsURL('idArmario');
        if (idArmario) {
            this.idArmario = idArmario;
        }
    }
}
</script>