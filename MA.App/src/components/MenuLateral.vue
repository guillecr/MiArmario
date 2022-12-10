<template>
<div @mouseout="HiddenMenu" ref="MenuLista">
    <div class="MenuToggel">
        <i alt="Menu" class="fi fi-rr-apps MenuBoton" @click="ShowMenu"/>
        <!-- <span class="MenuBoton" @click="ShowMenu"></span> -->
        {{pageName}}
    </div>
    <div id="Menu" class="MenuRaiz" :style="{left: (visible?'0':'-225px')}" >
        <div class="MenuContenedor" >
            <div class="MenuLista">
                <div class="MenuLabel" v-for="accion in acciones" :key="accion.IdMenu" @click="NavegationTo(accion.TxPath)">
                    {{accion.TxName}}
                </div>
            </div>
            <div class="MenuInfo">
                <img class="MenuIcon" alt="Logo" src="../assets/logo.png">
                <span style="text-align: right;">Versión: {{version}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    sockets: {
        Menus(paginas) {
            this.acciones = paginas;
        }
    },
    data: function(){
        return {
            acciones: [],
            visible: false
        }
    },
    props: {
        version: String,
    },
    computed: {
        pageName: function(){
            return this.$route.name;
        }
    },
    methods: {
        ShowMenu: function(){
            this.visible = !this.visible;
        },
        HiddenMenu: function(ev){
            var e = ev.toElement || ev.relatedTarget;
            while (e && e !== this.$refs.MenuLista){
                e = e.parentNode;
            }
            if (!e){
                this.visible = false;
            }
        },
        NavegationTo: function(TxPath){
            if (this.$route.path != TxPath){
                this.$router.push({ path: TxPath });
            }
            this.visible = false;
        }
    }
}
</script>
<style scoped>
#Menu{
    z-index: 500;
}
.MenuToggel{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 2px;
    height: 50px;
    background-color: rgb(74, 144, 177);
    color: white;
    font-size: 24px;
    text-align: left;
    padding-left: 60px;
    padding-top: 7px;
}
.MenuBoton{
    position: absolute;
    top: 8px;
    left: 10px;
    font-size: 30px;
    color: white;
}
.MenuHeader{
    color:black;
    background-image: url("../assets/logo.png");
    background-repeat: no-repeat;
    background-size: 48px 48px;
    padding-left: 26px;
}
.MenuRaiz{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    margin: 2px;
    width: 220px;
    margin: 2px;
    margin-bottom: 6px;
    transition: left 0.3s;
}
.MenuContenedor{
    height: 100%;
    background-color: rgb(74, 144, 177);
    border: 2px solid rgb(51, 100, 122);
    border-radius: 2px;
    color: white;
    text-align: left;
    z-index: 1000;
}
.MenuLista {
    margin-top:0;
}
.MenuLabel{
    padding: 4px;
    padding-inline-start: 14px;
    color:white;
    cursor: pointer;
}
.MenuLabel:hover{
    background-color:rgba(236, 236, 236, 0.712);
}
.MenuInfo{
    position: absolute;
    bottom: 0;
    padding: 10px;
    margin: 5px;
    background-color: #8debe2;
    font-size: 10px;
    border: 1px solid black;
    border-radius: 4px;
    right: 0;
    left: 0;
    color: black;
}
.MenuIcon{
    width: 100%;
}
a {
    color:white;
    text-decoration: none;
}
</style>