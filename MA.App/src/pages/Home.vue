<template>
    <div>
        <p>Pagina principal: {{socketMessage}}</p>
        <b-button variant="light" @click="pingServer">SOCKET</b-button>
        <label v-for="prenda in AllPrendas" :key="prenda.IdPrenda">
          <p>{{prenda.TxName}}</p>
        </label>
    </div>
</template>

<script>
    export default {
    data() {
        return {
            socketMessage: '',
            AllPrendas: []
        }
    },
    sockets: {
        // Si el servidor nos contesta con la cabecera "mensaje"
        mensaje(data) {
            this.socketMessage = data
        },
        AllPrendas(data) {
            this.AllPrendas = data;
        }
    },
    methods: {
        pingServer() {
            // Send the "pingServer" event to the server.
            this.$socket.emit('test', 'PING!')
        }
    }
}
</script>