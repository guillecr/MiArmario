<template>
    <div id="PagMisPrendas" style="position: relative;">
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
                <b-list-group-item style="cursor: pointer;" v-for="elm in listArmarios" :key="elm.value"
                    @click="idArmario=elm.value" 
                    :active="elm.value == idArmario">{{elm.text}}
                </b-list-group-item>
            </b-list-group>
            <br>
            Estados
            <b-form-checkbox v-for="flt in lstFltPrendas.lstFilterStates" :key="flt.IdLiteralValue"
                style="position: relative; width: 200px; text-align: left;"
                v-model="fltPrendas.lstStates[flt.IdLiteralValue]"
            >{{flt.TxDescription}}</b-form-checkbox>
            <br>
            Sub-Estado
            <b-form-checkbox v-for="flt in lstFltPrendas.lstFilterSubstates" :key="flt.IdLiteralValue"
                style="position: relative; width: 200px; text-align: left;"
                v-model="fltPrendas.lstSubstates[flt.IdLiteralValue]"
            >{{flt.TxDescription}}</b-form-checkbox>

        </div>
        <div class="PagMisPrendasPrendas">
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
    </div>
</template>
<style scoped>
    .PagMisPrendasPrendas{
        position: absolute;
        top:5px;
        left: 210px;
        width: 100%;
    }
    #PagMisPrendasJumnotron{
        background-color: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .PagMisPrendasListArmarios{
        position: absolute;
        top:5px;
        left: 0;
        width: 200px;
        padding: 10px;
    }
    @media (max-width: 485px) {
        .PagMisPrendasPrendas{
            position: relative;
            left: 5px;
        }
        .PagMisPrendasListArmarios{
            position: relative;
        }
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
            fltPrendas:{lstStates:{}, lstSubstates:{}},
            lstFltPrendas:{},
            chShowDlgClothes: false,
            objSelectClothes: {},
            serviceName:"PagMisPrendas",
            nuDlgPosX: 100,
            nuDlgPosY: 100
        }
    },
    watch: {
        fltPrendas:{
            handler(){
                if (this.idArmario){
                    this.refreshClothes();
                }
            },
            deep: true
        },
        idArmario(newValue){
            if (newValue){
                this.refreshClothes();
            }
        }
    },
    methods:{
        getLstFilter(){
            var lst = {lstStates: [], lstSubstates: []};
            if (this.fltPrendas.lstStates) {
                for (var i = 0; i < Object.keys(this.fltPrendas.lstStates).length; i++){
                    var keyState = Object.keys(this.fltPrendas.lstStates)[i];
                    if (this.fltPrendas.lstStates[keyState]){
                        lst.lstStates.push(keyState);
                    }
                }
            }
            if (this.fltPrendas.lstSubstates) {
                for (var j = 0; j < Object.keys(this.fltPrendas.lstSubstates).length; j++){
                    var keySubstate = Object.keys(this.fltPrendas.lstSubstates)[j];
                    if (this.fltPrendas.lstSubstates[keySubstate]){
                        lst.lstSubstates.push(keySubstate);
                    }
                }
            }
            return lst;
        },
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
                cm.objSelectClothes = {ChEdit: true};
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
            var lstFilter = this.getLstFilter();
            this.sEmit.emitCall( 'GetInfo', {idArmario: this.idArmario, flt: lstFilter}, function(response){
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
        var cm = this;
        if (idArmario) {
            this.idArmario = idArmario;
        }
        this.sEmit.emitCall('GetFilters', null, function(response){
            if (response){
                cm.lstFltPrendas.lstFilterStates = response.lstStates;
                cm.lstFltPrendas.lstFilterSubstates = response.lstSubstates;
            }
            
        });
    }
}
</script>