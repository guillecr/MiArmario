<template>
    <div>
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
        <div id="PagMisPrendas">
            <div class="PagMisPrendasListArmarios">
                Mis armarios
                <b-list-group>
                    <b-list-group-item style="cursor: pointer;" v-for="elm in listArmarios" :key="elm.value"
                        @click="idArmario=elm.value" 
                        :active="elm.value == idArmario">{{elm.text}}
                    </b-list-group-item>
                </b-list-group>
                <br>
                <b-button v-b-toggle.filters variant="outline-info">Filtros</b-button>
                <b-collapse id="filters" class="mt-2">
                    Tipo
                    <b-form-checkbox v-for="flt in lstFltPrendas.lstFilterTypes" :key="flt.IdLiteralValue"
                        style="position: relative; width: 200px; text-align: left;"
                        @change="setFilter('TYPE', flt.IdLiteralValue, $event)"
                    >{{flt.TxDescription}}</b-form-checkbox>
                    <br>
                    Estado
                    <b-form-checkbox v-for="flt in lstFltPrendas.lstFilterStates" :key="flt.IdLiteralValue"
                        style="position: relative; width: 200px; text-align: left;"
                        @change="setFilter('STATE', flt.IdLiteralValue, $event)"
                    >{{flt.TxDescription}}</b-form-checkbox>
                    <br>
                    Condición
                    <b-form-checkbox v-for="flt in lstFltPrendas.lstFilterSubstates" :key="flt.IdLiteralValue"
                        style="position: relative; width: 200px; text-align: left;"
                        @change="setFilter('SUBSTATE', flt.IdLiteralValue, $event)"
                    >{{flt.TxDescription}}</b-form-checkbox>
                </b-collapse>
            </div>
            <div class="PagMisPrendasPrendas">
                <b-jumbotron id="PagMisPrendasJumnotron" 
                    :header="objArmario.TxName" 
                    :lead="objArmario.TxDescription">
                </b-jumbotron>
                <div class="PagMisPrendasDivBtnAdd">            
                    <b-btn class="PagMisPrendasBtnAdd"
                        variant="outline-primary"
                        @click="showClothes({event:$event,row:{}})"
                    ><span style="padding-top: 4px;" class="fi-rr-plus"></span><span style="margin-left: 5px;">Añadir</span></b-btn>
                </div>
                <div class="overflow-auto">
                    <b-pagination 
                        pills 
                        align="fill" 
                        style="padding-right: 8px; padding-top: 4px;" 
                        v-model=nuPage
                        :per-page="nuPrendPerPage"
                        :total-rows="objArmario.NuPrendas"></b-pagination>
                </div>
                <listcards class="PagMisPrendasListPrendas"
                    :list="listPrendas"
                    Cdkey="IdPrenda"
                    @row-selected="showClothes">
                </listcards>
            </div>
        </div>
    </div>
</template>
<style scoped>
    #PagMisPrendas {
        position: relative;
    }
    .PagMisPrendasPrendas{
        position: absolute;
        top:5px;
        left: 210px;
    }
    #PagMisPrendasJumnotron{
        background-color: transparent;
        padding-top: 20px;
        padding-bottom: 0;
        margin-bottom: 0rem; /* El margen lo da PagMisPrendasDivBtnAdd */
    }
    .PagMisPrendasListArmarios{
        position: absolute;
        top:5px;
        left: 0;
        width: 200px;
        padding: 10px;
    }
    .PagMisPrendasDivBtnAdd{
        width: 100%;
        height: 32px;
        padding-right: 10%;
        margin-bottom: 1rem;
    }
    .PagMisPrendasBtnAdd{
        display: flex;
        align-items: center;
        height: 32px;
        padding-left: 6px;
        float: right;
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
            idArmario: null,
            txArmario: null,
            listPrendas: [],
            objArmario: {},
            listArmarios: [],
            fltPrendas: { lstStates:[], lstSubstates:[], lstTypes:[] },
            lstFltPrendas: {},
            chShowDlgClothes: false,
            objSelectClothes: {},
            serviceName: "PagMisPrendas",
            nuDlgPosX: 100,
            nuDlgPosY: 100,
            nuPage: 1,
            nuPrendPerPage: 5
        }
    },
    watch: {
        nuPage(){
            this.refreshClothes();
        },
        idArmario(newValue) {
            if (newValue) {
                this.refreshClothes();
            }
        }
    },
    methods:{
        setFilter(type, filter, value){
            let lst;
            switch (type) {
                case 'TYPE':
                    lst = this.fltPrendas.lstTypes;
                    break;
                case 'STATE':
                    lst = this.fltPrendas.lstStates;
                    break;
                case 'SUBSTATE':
                    lst = this.fltPrendas.lstSubstates;
                    break;
            }
            if (value) {
                lst.push(filter);
            } else {
                lst.splice(lst.indexOf(filter), 1);
            }
            this.refreshClothes();
            this.nuPage = 1;
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
                cm.objSelectClothes = {ChEdit: true, CdCloset:this.idArmario};
                cm.chShowDlgClothes = true;
            }
        },
        async saveClothes(frm){
            var cm = this;
            if (frm.ObjImg && frm.ObjImg.value){
                frm.ObjImg.value = await tools.downscaleImage(frm.ObjImg.value, 600);
            }
            cm.sEmit.emitCall('SavePrenda', frm, cm.saveClothesResponse);
            
        },
        saveClothesResponse(response){
            var msg = "Error en el guardado";
            if (response) {
                msg = "Guardado correctamente"
            }
            this.$bvToast.toast(msg, {
                title: 'Guardado de ropa',
                autoHideDelay: 5000,
                appendToast: true
            });

            this.objSelectClothes = {};
            this.chShowDlgClothes = false;
            this.refreshClothes();
        },
        refreshClothes(){
            var cm = this;
            this.sEmit.emitCall( 'GetInfo', {idArmario: this.idArmario, flt: cm.fltPrendas, nuPage: this.nuPage}, function(response){
                // TODO: La obtenión de la lista de armarios podría ya dar toda la definición del armario, en vez de pedir de nuevo la información
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
                cm.lstFltPrendas.lstFilterTypes = response.lstTypes;
                cm.nuPrendPerPage = response.nuPrendPerPage;
            }
            
        });
    }
}
</script>