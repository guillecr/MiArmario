<template>
    <div id="FormDPrendas">
    </div>
</template>

<script>

export default {
    sockets: {
        AllPrendas(data) {
            this.AllPrendas = data;
        }
    },
    data(){
        return {
            AllPrendas: []
        }
    },
    methods:{
        onSubmit: function(){
            debugger;
        },
        onReset: function(){
            debugger;
        }
    }
}
</script>