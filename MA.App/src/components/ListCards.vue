<style scoped>
    #ListCartsElm img {
        height: 20rem;
    }
</style>
<template>
    <div ref="ListCarts">
        <!-- Hay que indicar cual es la clave. La idea será que tenga un campo key -->
        <b-card-group deck>
            <b-card id="ListCartsElm" v-for="elm in list" :key="elm[txKey]"
                :title="elm.TxName"
                :img-src="elm.BiImg"
                img-alt="Card Image"
                img-top
                tag="article"
                style="max-width: 20rem;;"
                class="mb-2"
                @click="selectCart(elm)"
            >
                <b-card-text>
                    Estado <b-badge>{{elm.TxState}}</b-badge>
                </b-card-text>
            </b-card>
        </b-card-group>

    </div>
</template>
<script>
    export default {
        props: {
            list: Array,
            txKey: String
        },
        data(){
            return {

            }
        },
        methods:{
            selectCart(cart){
                this.$emit('row-selected', cart);
            }
        }
    }
</script>