<style scoped>
    .DynamicFormDiv {
        position: relative;
        /* left: 13px;
        top: 13px; */
        width: 100vw;
    }
    .DynamicFormElement {
        position: absolute;
        margin: 0;
        z-index: 50;
    }
    .DynamicFormElementText {
        height: 26px;
        display: initial;
        padding-left: 10px;
        font-size: 14px;
        
    }
    .DynamicFormElementList{
        height: 26px;
        display: initial;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 10px;
        font-size: 14px;
    }
    .DynamicFormElementDate {
        height: 26px;
        display: initial;
        font-size: 14px;
    }
    .DynamicFormElementDatetime{
        height: 26px;
        display: initial;
        font-size: 14px;
    }
    .DynamicFormElementCheck {
        display: initial;
    }
    .DynamicFormLabel {
        text-align: left;
        margin-bottom: 0;
        font-size: 14px;
    }
    .DynamicFormResizeX, .DynamicFormResizeLabel {
        border: 1px dotted rgb(85, 85, 85);
        width: 8px;
        height: 12px;
        position: absolute;
        cursor: e-resize;
        z-index: 50;
    }
    .DynamicFormResizeLabel {
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .DynamicFormResizeX {
        top:0;
        bottom: 0;
        margin: auto;
        right: -4px;
    }
    .DynamicFormResizeY {
        border: 1px dotted rgb(85, 85, 85);
        width: 12px;
        height: 8px;
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        margin: auto;
        cursor: n-resize;
        z-index: 50;
    }
    .DynamicFormMove {
        position: absolute;
        background-color: rgba(85, 85, 85, 0.3);
        border: 1px dotted rgb(85, 85, 85);
        border-radius: 3px;
        top: 0;
        height: 100%;
        width: 100%;
        cursor: all-scroll;
        z-index: 40;
    }
    .DynamicFormPropeties {
        position: fixed;
        right: 0;
        bottom: 30px;
        border: 1px solid black;
        border-radius: 5px;
        padding: 3px;
        height: 460px;
        width: 300px;
        background-color: white;
        z-index: 100;
    }

</style>

<template>
    <div class="DynamicFormDiv"
        :style="{
            height:this.heightForm + 'px',
            width:this.widthForm + 'px'
        }"
    >
        <b-form-checkbox v-if="adminMode"
            id="checkbox-edit"
            style="position: absolute; top: 0; left: 400px; width: 50px;"
            v-model="formEdit"
            name="checkbox-edit"
            :value="true"
            :unchecked-value="false"
        >Editar</b-form-checkbox>
        <b-btn v-if="formEdit" variant="success" class="FormButtom" style="position: absolute; top: 0; left: 500px; width: 70px;" @click="saveForm">Guardar</b-btn>
        <b-btn v-if="formEdit" class="FormButtom" style="position: absolute; top: 0; left: 575px; width: 120px;" @click="addCtrl">Añadir control</b-btn>
        <b-btn v-if="formEdit" variant="danger" class="FormButtom" style="position: absolute; top: 0; left: 700px; width: 120px;" @click="deleteCtrl">Eliminar control</b-btn>

        <!-- Caja de propiedades -->
        <div v-if="formEdit && ctrlActive && ctrlActive.length && ctrlActive[0]"
            class="DynamicFormPropeties"
            :style="{
                visible: (chVisiblePropeties)?'visible':'',
                height: (ChMiminicePropeties)? '40px':''
                }">
            <label
                style="position: absolute;
                    top:10px;
                    left:10px;"
            >Propiedades</label>
            <b-btn
                variant="danger"
                size="sm"
                style="
                    position: absolute;
                    width:36px;
                    height:24px;
                    top:10px;
                    right: 10px;"
                @click="ctrlActive=[]"
            ><span class="fi fi-rr-cross-small"></span></b-btn>
            <b-btn
                variant="secondary"
                size="sm"
                style="
                    position: absolute;
                    width:36px;
                    height:24px;
                    top:10px;
                    right: 48px;"
                @click="MiminicePropeties"
            ><span class="fi fi-rr-minus-small"></span></b-btn>
            <hr style="position: absolute;
                top:40px;
                width: 97%;
                margin: 0;"/>

            <!-- Campo de tipo -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'50px'}"
                ><label class="DynamicFormLabel" style="width:100px;">Tipo</label>
                <b-form-select class="DynamicFormElementText"
                    type="text"
                    :options="ListTypesCtrls"
                    size="sm"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].CdType" />
            </label>

            <!-- Campo de cabecera -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'78px'}"
                ><label class="DynamicFormLabel" style="width:100px;">Cabecera</label>
                <b-form-input class="DynamicFormElementText"
                    type="text"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].TxLabel" />
            </label>

            <!-- Campo de fieldName-->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'106px'}"
                ><label class="DynamicFormLabel" style="width:100px;">Campo</label>
                <b-form-input class="DynamicFormElementText"
                    type="text"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].CdField" />
            </label>

            <!-- Campo visible -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'134px'
                }"><label class="DynamicFormLabel" style="width:100px;">Visible</label>
                <b-form-input class="DynamicFormElementText"
                    type="text"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].TxVisible" />
            </label>

            <!-- Deshabilitado -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'162px'
                }"><label class="DynamicFormLabel" style="width:100px;">Deshabilitado</label>
                <b-form-input class="DynamicFormElementText"
                    type="text"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].TxDisabled" />
            </label>

            <!-- SQL Lista -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'190px'
                }"><label class="DynamicFormLabel" style="width:250px;display: block;">Lista</label>
                <b-form-textarea class="DynamicFormElementText"
                    no-resize
                    :style="{height:'104px'}"
                    v-model="ctrlActive[0].TxSqlList" />
            </label>

            <!-- Acción -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'320px'
                }"><label class="DynamicFormLabel" style="width:250px;display: block;">Acción</label>
                <b-form-textarea class="DynamicFormElementText"
                    no-resize
                    :style="{height:'104px'}"
                    v-model="ctrlActive[0].TxAction" />
            </label>
        </div>
        <!-- Fin de caja de propiedades -->

        <label class="DynamicFormElement" v-for="elm in ctrls" :key="elm.IdFormFields"
            :style="{left:elm.NuPosX + 'px'
                ,top:elm.NuPosY + 'px'
                ,height:elm.NuHeight + 'px'
                ,width:(elm.CdType == 'MULTILINE')?elm.NuWidth + 'px':''
                ,display:(calcVisibility(elm)? '':'none')
                ,cursor: ((adminMode && formEdit)? 'all-scroll':'auto')}"

            @click="selectCtrl(elm)"
        >

            <label class="DynamicFormLabel"
                v-if="elm.CdType != 'BTN'"
                :style="{width: elm.NuWidthLabel + 'px'
                    ,display: (elm.CdType == 'MULTILINE')?'block':''}">
                {{elm.TxLabel}}
            </label>
            <div class="DynamicFormResizeLabel"
                v-if="adminMode && formEdit && (
                    elm.CdType == 'TEXT' ||
                    elm.CdType == 'DATE' ||
                    elm.CdType == 'DATETIME' ||
                    elm.CdType == 'LABEL' ||
                    elm.CdType == 'LST' ||
                    elm.CdType == 'CHECK'
                )"
                :style="{left:(elm.NuWidthLabel - 4) + 'px'}"
                @mousedown="mouseDownLabel(elm, $event, $event.target.parentElement)"
            ></div>

            <b-btn class="FormButtom"
                v-if="elm.CdType=='BTN'"
                :disabled="calcDisabled(elm)"
                :style="{width:elm.NuWidth + 'px'}"
                @click="calcAction(elm.TxAction)"
            >{{elm.TxLabel}}</b-btn>

            <b-form-input class="DynamicFormElementText"
                v-if="elm.CdType=='TEXT'"
                type="text"
                :style="{width:elm.NuWidth + 'px'}"
                :disabled="calcDisabled(elm)"
                v-model="objForm[elm.CdField]"
            />
            <b-form-input class="DynamicFormElementDate"
                v-if="elm.CdType=='DATE'"
                type="date"
                :style="{width:NuWidthDate + 'px'}"
                :disabled="calcDisabled(elm)"
                v-model="objForm[elm.CdField]"
            />
            <b-form-input class="DynamicFormElementDatetime"
                v-if="elm.CdType=='DATETIME'"
                type="datetime-local"
                :style="{width:NuWidthDateTime + 'px'}"
                :disabled="calcDisabled(elm)"
                v-model="objForm[elm.CdField]"
            />

            <b-form-checkbox class="DynamicFormElementCheck"
                v-if="elm.CdType=='CHECK'"
                :disabled="calcDisabled(elm)"
                v-model="objForm[elm.CdField]"
            ></b-form-checkbox>

            <b-form-select class="DynamicFormElementList"
                v-if="elm.CdType=='LST'"
                type="text"
                :options="getListFill(elm)"
                size="sm"
                :style="{width:elm.NuWidth + 'px'}"
                v-model="objForm[elm.CdField]" />

            <b-form-textarea class="DynamicFormElementMultiline"
                v-if="elm.CdType=='MULTILINE'"
                no-resize
                :style="{height:(elm.NuHeight - 2 * gridSizeY) + 'px'}"
                :disabled="calcDisabled(elm)"
                v-model="objForm[elm.CdField]" />

            <div class="DynamicFormMove"
                v-if="adminMode && formEdit"
                @mousedown.stop="mouseDownMove(elm, $event, $event.target.parentElement)">
            </div>
            <div class="DynamicFormResizeX"
                v-if="adminMode && formEdit && (
                    elm.CdType == 'TEXT' ||
                    elm.CdType == 'LST' ||
                    elm.CdType == 'BTN' ||
                    elm.CdType == 'MULTILINE'
                )"
                @mousedown="mouseDownSizeX(elm, $event, $event.target.parentElement)"
            ></div>
            <div
                v-if="adminMode && formEdit && (
                    elm.CdType == 'LABEL' ||
                    elm.CdType == 'MULTILINE'
                )" class="DynamicFormResizeY"
                @mousedown="mouseDownSizeY(elm, $event, $event.target.parentElement)"
            ></div>
        </label>
    </div>
</template>
<script>

import tools from "../tools";
import SocketEmit from "../SocketEmit";

export default {
    props:{
        idForm: String,
        objForm: Object,
        adminMode: {
            type: Boolean,
            default: false
        }
    },
    data: function(){
        return {
            sEmit: new SocketEmit(this.$socket, this.sockets, 'DynamicForm'),
            serviceName:'DynamicForm',
            ctrls: [],
            ctrlActive: [],
            formEdit: false,
            mousePosX: null,
            mousePosY: null,
            gridSizeX: 10,
            gridSizeY: 13,
            sizeRef: 0,
            posXRef: 0,
            posYRef: 0,
            chVisiblePropeties: true,
            ChMiminicePropeties: false,
            NuWidthDate: 140,
            NuWidthDateTime: 190,
            ListTypesCtrls:[
                {value:'TEXT', text:'Texto'},
                {value:'DATE', text:'Fecha'},
                {value:'DATETIME', text:'Tiempo'},
                {value:'LABEL', text:'Etiqueta'},
                {value:'LST', text:'Lista'},
                {value:'CHECK', text:'Check'},
                {value:'BTN', text:'Botón'},
                {value:'MULTILINE', text:'Multilinea'}
            ]
        }
    },
    computed: {
        heightForm() {
            var nuHeight = 0;
            for (const elm in this.ctrls) {
                var ctrl = this.ctrls[elm];

                if (ctrl.NuPosY + (ctrl.NuHeight || 26) > nuHeight) { // El tamaño mínimo de los controles es 26
                    nuHeight = ctrl.NuPosY + (ctrl.NuHeight || 26);
                }
            }
            return nuHeight;
        },
        widthForm() {
            var nuWidth = 1000;
            if (!this.adminMode){
                nuWidth = 0;
                for (const elm in this.ctrls) {
                    var ctrl = this.ctrls[elm];
                    
                    if (ctrl.Cdtype == 'DATE'){
                        ctrl.NuWidth = this.NuWidthDate;
                    } else if (ctrl.CdType == 'DATETIME'){
                        ctrl.NuWidth = this.NuWidthDateTime;
                    }

                    var maxWidthCtrl = ctrl.NuPosX + (ctrl.NuWidth || 0) + (ctrl.NuWidthLabel || 0);
                    if (maxWidthCtrl > nuWidth) {
                        nuWidth = maxWidthCtrl;
                    }
                }
            }
            return nuWidth;
        }
    },
    methods: {
        getCtrl: function(IdFormField){
            for (var i in this.ctrls){
                if (this.ctrls[i].IdFormField == IdFormField) {
                    return this.ctrls[i];
                }
            }
            return null;
        },
        getListFill: function(ctrl){
            if (ctrl.ListFill){
                return ctrl.ListFill;
            }
        },
        refreshListFill: function(ctrl){
            this.sEmit.emitCall('GetListFill', ctrl.IdFormField, function(response){
                // TODO: Cuidado si se da el caso de enviar varias peticiones de diferentes controles a la vez
                // TODO: No funciona
                ctrl.ListFill = response.listFill;
            });
        },
        refreshAllListFill: function(){
            for (var i in this.ctrls){
                if (this.ctrls[i].CdType == 'LST'){
                    this.refreshListFill(this.ctrls[i]);
                }
            }
        },
        calcEval: function(exp) {
            var frm = this.objForm;
            var cm = this;
            return eval(exp);
        },
        calcVisibility: function(ctrl) {
            if (this.formEdit) {
                return true;
            }
            if (ctrl && ctrl.TxVisible){
                return !!this.calcEval(ctrl.TxVisible);
            }
            return false;
        },
        calcDisabled: function(ctrl) {
            if (this.formEdit){
                return true;
            }
            if (ctrl && typeof ctrl.TxDisabled != 'undefined') {
                return !!this.calcEval(ctrl.TxDisabled);
            }
            return true;
        },
        calcAction: function(exp){
            this.calcEval(exp);
        },
        MiminicePropeties: function(){
            this.ChMiminicePropeties = !this.ChMiminicePropeties;
        },
        selectCtrl: function(ctrl) {
            if (this.adminMode && this.formEdit) {
                this.ctrlActive = [ctrl];
                this.chVisiblePropeties = true;
            }
        },
        addCtrl: function () {
            this.ctrls.push({
                CdType: 'TEXT',
                TxLabel: 'Nuevo',
                NuPosY: 10,
                NuPosX: 10,
                NuWidth: 50,
                NuWidthLabel: 60,
                NuHeight: 26,
                CdField: '',
                TxDisabled: '0',
                TxVisible: '1'
            });
        },
        deleteCtrl: function () {
            this.ctrls.splice(this.ctrls.indexOf(this.ctrlActive[0]), 1);
        },
        saveForm: function () {
            var cm = this;
            this.sEmit.emitCall("SaveForm", {CdForm: this.idForm, ctrls: this.ctrls}, function(response) {
                var msg = 'Error en el guardado';
                if (response) {
                    msg = 'Guardado correctamente';
                }
                cm.$bvToast.toast(msg, {
                    title: 'Guardado de formulario',
                    autoHideDelay: 5000,
                    appendToast: true
                });
            });
        },
        mouseDownMove: function (ctrl, ev, elm){
            if (this.adminMode && this.formEdit){
                this.posXRef = ctrl.NuPosX - ev.clientX;
                this.posYRef = ctrl.NuPosY - ev.clientY;
                this.ctrlActive = [ctrl];
                document.addEventListener('mousemove', this.mouseMove);
                document.addEventListener('mouseup', this.mouseUp);
            }
            return tools.pauseEvent(ev);
        },
        mouseMove: function(ev){
            var posx = this.posXRef + ev.clientX;
            var posy = this.posYRef + ev.clientY;
            this.ctrlActive[0].NuPosX = posx - posx % this.gridSizeX;
            this.ctrlActive[0].NuPosY = posy - posy % this.gridSizeY;
            return tools.pauseEvent(ev);
        },
        mouseDownSizeX: function (ctrl, ev, elm) {
            document.activeElement.getBoundingClientRect();
            this.ctrlActive = [ctrl];
            this.mousePosX = ev.clientX;
            this.sizeRef = ctrl.NuWidth;
            document.addEventListener('mousemove', this.mouseSizeX);
            document.addEventListener('mouseup', this.mouseUp);
            return tools.pauseEvent(ev);
        },
        mouseDownSizeY: function (ctrl, ev, elm){
            document.activeElement.getBoundingClientRect();
            this.ctrlActive = [ctrl];
            this.mousePosY = ev.clientY;
            this.sizeRef = ctrl.NuHeight;
            document.addEventListener('mousemove', this.mouseSizeY);
            document.addEventListener('mouseup', this.mouseUp);
            return tools.pauseEvent(ev);
        },
        mouseDownLabel: function (ctrl, ev, elm) {
            this.ctrlActive = [ctrl];
            this.mousePosX = ev.clientX;
            this.sizeRef = [ctrl.NuWidthLabel || 60];
            document.addEventListener('mousemove', this.mouseSizeLabel);
            document.addEventListener('mouseup', this.mouseUp);
            return tools.pauseEvent(ev);
        },
        mouseSizeX: function (ev) {
            var difSize = ev.clientX - this.mousePosX;
            var newSize = (difSize - difSize % this.gridSizeX) + this.sizeRef;
            for (var idx in this.ctrlActive){
                var ctrl = this.ctrlActive[idx];
                ctrl.NuWidth = newSize;
                return tools.pauseEvent(ev);
            }
        },
        mouseSizeY: function (ev) {
            var difSize = ev.clientY - this.mousePosY;
            var newSize = (difSize - difSize % this.gridSizeY) + this.sizeRef;
            for (var idx in this.ctrlActive){
                var ctrl = this.ctrlActive[idx];
                ctrl.NuHeight = newSize;
                return tools.pauseEvent(ev);
            }
        },
        mouseSizeLabel: function (ev) {
            var difSize = ev.clientX - this.mousePosX;
            for (var idx in this.ctrlActive){
                var newSize = (difSize - difSize % this.gridSizeX) + this.sizeRef[idx];
                var ctrl = this.ctrlActive[idx];
                ctrl.NuWidthLabel = newSize;
            }
            return tools.pauseEvent(ev);

        },
        mouseUp: function (ev) {
            document.removeEventListener('mousemove', this.mouseSizeLabel);
            document.removeEventListener('mousemove', this.mouseSizeX);
            document.removeEventListener('mousemove', this.mouseSizeY);
            document.removeEventListener('mousemove', this.mouseMove);
            document.removeEventListener('mouseup', this.mouseUp);
            return tools.pauseEvent(ev);
        }
    },
    watch:{
        idForm: function (newId) {
            var cm = this;
            this.sEmit.emitCall("GetInfo", newId, function(response) {
                cm.ctrls = response;
            });
            this.ctrlActive = [];
            this.formEdit = false;
        }
    },
    mounted() {
        var cm = this;
        this.sEmit.emitCall("GetInfo", this.idForm, function(response) {
            cm.ctrls = response;
        });
    }
}
</script>
