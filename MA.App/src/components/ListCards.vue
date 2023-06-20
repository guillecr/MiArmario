<style scoped>
    #ListCartsElm img {
        width: unset;
        max-width: 100%;
        height: 25vw;
    }
    .card-title {
        font-size: 2.5vw;
    }
    #ListCartsElm{
        width: 22%;
        min-width: 18vw;
        margin-left: 2%;
        float: left;
        z-index: 50;
    }
    @media (max-width: 485px) {
        #ListCartsElm {
            width: 45%;
        }
        #ListCartsElm img {
            height: 40vw;
        }
        .card-title {
            font-size: 6vw;
        }
    }
</style>
<template>
    <div ref="ListCarts">
        <!-- Hay que indicar cual es la clave. La idea será que tenga un campo key -->
        <div class="ListCartsGroup">
            <b-card id="ListCartsElm" v-for="elm in listCart" :key="elm[Cdkey]"
                :title="elm.TxName"
                :img-src="elm.BiImg"
                img-alt="Card Image"
                img-top
                tag="article"
                class="mb-2"
                @click="selectCart($event, elm)"
            >
                <b-card-text v-if="elm.TxState">
                    Estado <b-badge>{{elm.TxState}}</b-badge>/<b-badge>{{ elm.TxSubstate }}</b-badge>
                </b-card-text>
            </b-card>
        </div>

    </div>
</template>
<script>
    export default {
        props: {
            list:Array,
            Cdkey: String,
            nameNew: String
        },
        data(){
            return {
                nuColumns:4
            }
        },
        computed: {
            listCart: function(){
                // Si no está definida la lista, devolverémos una lista vacía
                // Si está definida la lista, la copiaremos, evitando objeto por referencia
                var listCopy = [];
                if (this.list){
                    listCopy = this.list.slice();
                }                
                // Si tenemos definido el nombre para un elemento nuevo, lo incluimos
                if (this.nameNew){
                    listCopy.push({TxName: this.nameNew});
                }

                return listCopy;
            }
        },
        methods:{
            selectCart(ev, elm){
                this.$emit('row-selected', {event:ev, row:elm});
            }
        }
    }
</script>