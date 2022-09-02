<style scoped>
    #ListCartsElm{
        float: left;
        margin-right: 5px;
    }
</style>
<template>
    <div ref="ListCarts">
        <!-- elm.IdPrenda como ejemplo. La idea será que tenga un campo key -->
        <b-card id="ListCartsElm" v-for="elm in list" :key="elm.IdPrenda"
            :title="elm.TxName"
            :img-src="elm.BiImg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
        >
            <b-card-text>
                Estado <b-badge>{{elm.TxState}}</b-badge>
            </b-card-text>
        </b-card>
    </div>
</template>
<script>
    export default {
        props: {
            list: Array
        }
    }
</script>