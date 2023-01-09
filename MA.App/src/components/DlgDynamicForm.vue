<style>
    .DlgDynamicForm {
        position: absolute;
        z-index: 100;
        background-color: white;
        border: 1px black solid;
        border-radius: 5px;
        box-shadow: 5px 5px 15px rgb(58, 58, 58);
        /* padding: 0 10px 10px 10px; */
    }
    .DlgDynamicFormHead {
        position: relative;
        height: 40px;
        width: 100%;
        cursor: all-scroll;
    }
    .DlgDynamicFormTitle {
        position: absolute;
        padding: 10px;
        left: 0;

    }
    .DlgDynamicFormFrm {
        position: relative;
        margin: 15px;
    }
</style>

<template>
    <div class="DlgDynamicForm"
        :style="{
            'top':(nuPosY) + 'px',
            'left':(nuPosX) + 'px'
        }">
        <div class="DlgDynamicFormHead"
            @mousedown.stop="mouseDownMove($event, $event.target.parentElement)">
            <span class="DlgDynamicFormTitle">{{ txTitle }}</span>
            <b-btn
                variant="danger"
                size="sm"
                style="
                    position: absolute;
                    width:36px;
                    height:24px;
                    top:10px;
                    right: 10px;
                    z-index: 101;"
                @click="$emit('close')"
            ><span class="fi fi-rr-cross-small"></span></b-btn>
        </div>
        <dynamic-form class="DlgDynamicFormFrm"
            :idForm="idForm"
            :objForm="objFrom"
            @close="$emit('close')"
            @finalize="$emit('finalize',$event)"
        />
    </div>
</template>

<script>
    import DynamicForm from '../components/DynamicForm.vue';
    import tools from '../tools';

    export default {
        components:{
            DynamicForm
        },
        props:{
            idForm: String,
            objFrom: {
                type: Object,
                default() {return {};}
            },
            nuPosXInit: {
                type: Number,
                default: 100
            },
            nuPosYInit: {
                type: Number,
                default: 100
            },
            txTitle: String,
            callBack: Function,
        },
        computed:{
            nuPosX() {
                return this.nuPosX_ || this.nuPosXInit;
            },
            nuPosY() {
                return this.nuPosY_ || this.nuPosYInit;
            }
        },
        data(){
            return {
                posXRef: 0,
                posYRef: 0,
                nuPosX_: null,
                nuPosY_: null
            }
        },
        methods: {
            mouseDownMove: function (ev){
                this.posXRef = this.nuPosX - ev.clientX;
                this.posYRef = this.nuPosY - ev.clientY;
                document.addEventListener('mousemove', this.mouseMove);
                document.addEventListener('mouseup', this.mouseUp);
                return tools.pauseEvent(ev);
            },
            mouseMove: function(ev){
                var posx = this.posXRef + ev.clientX;
                var posy = this.posYRef + ev.clientY;
                this.nuPosX_ = posx; // Modificamos el valor interno
                this.nuPosY_ = posy; // Modificamos el valor interno
                return tools.pauseEvent(ev);
            },
            mouseUp: function (ev) {
                document.removeEventListener('mousemove', this.mouseMove);
                document.removeEventListener('mouseup', this.mouseUp);
                return tools.pauseEvent(ev);
            }
        }
    }
</script>

