<style scoped>
    .DynamicFormDiv {
        position: relative;
        left: 13px;
        top: 13px;
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
    }
    .DynamicFormElementCheck {
        display: initial;
    }
    .DynamicFormLabel {
        text-align: left;
    }
    .DynamicFormResizeX {
        border: 1px dotted rgb(85, 85, 85);
        width: 8px;
        height: 12px;
        position: absolute;
        cursor: e-resize;
        z-index: 50;
    }
    .DynamicFormResizeY {
        border: 1px dotted rgb(85, 85, 85);
        width: 12px;
        height: 8px;
        position: absolute;
        cursor: n-resize;
        z-index: 50;
    }
    .DynamicFormPropeties {
        position: fixed;
        right: 0;
        bottom: 30px;
        border: 1px solid black;
        border-radius: 5px;
        padding: 3px;
        height: 450px;
        width: 250px;
        background-color: white;
        z-index: 50;
    }

</style>

<template>
    <div class="DynamicFormDiv" 
        :style="{
            height:this.heightForm + 'px',
            width:this.widthForm + 'px'}
        "
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

        <!-- Caja de propiedades -->
        <div v-if="formEdit && ctrlActive && ctrlActive.length && ctrlActive[0]" 
            class="DynamicFormPropeties"
            :style="{
                visible: (chVisiblePropeties)?'visible':'',
                height: (ChMiminicePropeties)? '40px':'450px'
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
                ><label class="DynamicFormLabel" style="width:70px;">Tipo</label>
                <b-form-select class="DynamicFormElementText" 
                    type="text"
                    :options="ListTypesCtrls"
                    size="sm"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].CdType" />
            </label>
            
            <!-- Cambpo de cabecera -->
            <label class="DynamicFormElement"
                :style="{
                    position: 'absolute',
                    left:'10px',
                    top:'78px'}"
                ><label class="DynamicFormLabel" style="width:70px;">Cabecera</label>
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
                ><label class="DynamicFormLabel" style="width:70px;">Campo</label>
                <b-form-input class="DynamicFormElementText" 
                    type="text"
                    :style="{width:'150px'}"
                    v-model="ctrlActive[0].CdField" />
            </label>
        </div>
        <!-- Fin de caja de propiedades -->

        <label class="DynamicFormElement" v-for="elm in ctrls" :key="elm.IdFormFields"
            :style="{left:elm.NuPosX + 'px'
                ,top:elm.NuPosY + 'px'
                ,height:elm.NuHeight + 'px'
                ,cursor: ((adminMode && formEdit)? 'all-scroll':'auto')}"
            @mousedown.stop="mouseDownMove(elm, $event, $event.target.parentElement)"
            @click="selectCtrl(elm)"
        >
                
                <label class="DynamicFormLabel"
                    :style="{width:elm.NuWidthLabel + 'px'}"
                >
                    {{elm.TxLabel}}
                </label>

            <b-form-input class="DynamicFormElementText" 
                type="text"
                :style="{width:elm.NuWidth + 'px'}"
                :disabled="adminMode && formEdit"
                v-if="elm.CdType=='TEXT'" 
                v-model="objForm[elm.CdField]" 
            />

            <b-form-checkbox class="DynamicFormElementCheck"
                v-if="elm.CdType=='CHECK'"
                :disabled="adminMode && formEdit"
                v-model="objForm[elm.CdField]"     
            ></b-form-checkbox>
            
            <div class="DynamicFormResizeX" 
                v-if="adminMode && formEdit && (
                    elm.CdType == 'TEXT' ||
                    elm.CdType == 'LABEL' ||
                    elm.CdType == 'CHECK'
                )" 
                :style="{
                    top:((elm.NuHeight / 2) - 6) + 'px',
                    left:(elm.NuWidthLabel - 3) + 'px'
                }"
                @mousedown="mouseDownLabel(elm, $event, $event.target.parentElement)"
            ></div>
            <div class="DynamicFormResizeX"
                v-if="adminMode && formEdit && (
                    elm.CdType == 'TEXT'
                )" 
                :style="{
                    top:((elm.NuHeight / 2) - 6) + 'px',
                    left:(elm.NuWidthLabel + elm.NuWidth - 6) + 'px'
                }"
                @mousedown="mouseDownSizeX(elm, $event, $event.target.parentElement)"
            ></div>
            <div 
                v-if="adminMode && formEdit && (
                    elm.CdType == 'TEXT'
                )" class="DynamicFormResizeY"
                :style="{
                    top:(elm.NuHeight - 3) + 'px',
                    left:(elm.NuWidthLabel + (elm.NuWidth / 2) - 6) + 'px'
                }"

            ></div>
        </label>
    </div>
</template>
<script>

import tool from "../tools";
export default {
    props:{
        idForm: String,
        objForm: Object,
        adminMode: Boolean
    },
    data: function(){
        return {
            ctrls: [],
            ctrlActive: [],
            formEdit: false,
            mousePosX: null,
            gridSizeX: 10,
            gridSizeY: 13,
            sizeRef: 0,
            posXRef: 0,
            posYRef: 0,
            chVisiblePropeties: true,
            ChMiminicePropeties: false,
            ListTypesCtrls:[
                {value:'TEXT', text:'TEXT'},
                {value:'LABEL', text:'LABEL'},
                {value:'CHECK', text:'CHECK'}
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
            var nuWidth = 0;
            for (const elm in this.ctrls) {
                var ctrl = this.ctrls[elm];
                var maxWidthCtrl = ctrl.NuPosX + (ctrl.NuWidth || 0) + (ctrl.NuWidthLabel || 0);
                if (maxWidthCtrl > nuWidth) { // El tamaño mínimo de los controles es 26
                    nuWidth = maxWidthCtrl;
                }
            }
            return nuWidth;
        }
    },
    methods: {
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
                NuWidthLabel: 60,
                NuWidth: 20,
                NuHeight: 26,
                CdField: 'TxTester',
                TxDisabled: '0',
                TxVisible: '1'
            });
        },
        saveForm: function () {
            // TODO: Crear una acción a la respuesta
            this.$socket.emit("DynamicFormSaveForm", {CdForm: this.idForm, ctrls: this.ctrls});
        },
        mouseDownMove: function (ctrl, ev, elm){
            if (this.adminMode && this.formEdit){
                this.posXRef = ctrl.NuPosX - ev.clientX;
                this.posYRef = ctrl.NuPosY - ev.clientY;
                this.ctrlActive = [ctrl];
                document.addEventListener('mousemove', this.mouseMove);
                document.addEventListener('mouseup', this.mouseUp);    
            }
            return tool.pauseEvent(ev);
        },
        mouseMove: function(ev){
            var posx = this.posXRef + ev.clientX;
            var posy = this.posYRef + ev.clientY;
            this.ctrlActive[0].NuPosX = posx - posx % this.gridSizeX;
            this.ctrlActive[0].NuPosY = posy - posy % this.gridSizeY;
            return tool.pauseEvent(ev);
        },
        mouseDownSizeX: function (ctrl, ev, elm) {
            document.activeElement.getBoundingClientRect();
            this.ctrlActive = [ctrl];
            this.mousePosX = ev.clientX;
            this.sizeRef = ctrl.NuWidth;
            document.addEventListener('mousemove', this.mouseSizeX);
            document.addEventListener('mouseup', this.mouseUp);
            return tool.pauseEvent(ev);
        },
        mouseDownLabel: function (ctrl, ev, elm) {
            this.ctrlActive = [ctrl];
            this.mousePosX = ev.clientX;
            this.sizeRef = [ctrl.NuWidthLabel];
            document.addEventListener('mousemove', this.mouseSizeLabel);
            document.addEventListener('mouseup', this.mouseUp);
            return tool.pauseEvent(ev);
        },
        mouseSizeX: function (ev) {
            var difSize = ev.clientX - this.mousePosX;
            var newSize = (difSize - difSize % this.gridSizeX) + this.sizeRef;
            for (var idx in this.ctrlActive){
                var ctrl = this.ctrlActive[idx];
                ctrl.NuWidth = newSize;
                return tool.pauseEvent(ev);
            }
        },
        mouseSizeLabel: function (ev) {
            var difSize = ev.clientX - this.mousePosX;
            for (var idx in this.ctrlActive){
                var newSize = (difSize - difSize % this.gridSizeX) + this.sizeRef[idx];
                var ctrl = this.ctrlActive[idx];
                ctrl.NuWidthLabel = newSize;
            }
            return tool.pauseEvent(ev);

        },
        mouseUp: function (ev) {
            document.removeEventListener('mousemove', this.mouseSizeLabel);
            document.removeEventListener('mousemove', this.mouseSizeX);
            document.removeEventListener('mousemove', this.mouseMove);
            document.removeEventListener('mouseup', this.mouseUp);
            return tool.pauseEvent(ev);
        }
    },
    sockets:{
        DynamicFormGetInfoResponse(response) {
            this.ctrls = response;
        },
        DynamicFormSaveFormRespone(response) {
            if (response) {
                this.$bvToast.toast(`Guardado correctamente`, {
                title: 'Guardado de formulario',
                autoHideDelay: 5000,
                appendToast: true
            });
            }
        }
    },
    watch:{
        idForm: function (newId) {
            this.$socket.emit("DynamicFormGetInfo", newId);
            this.ctrlActive = [];
            this.formEdit = false;
        }
    },
    mounted() {
        this.$socket.emit("DynamicFormGetInfo", this.idForm);
    }
}
</script>
