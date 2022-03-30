<template>
    <div>
        <p>Inicio de sesión</p>

        <b-form id="LoginInForm" @keyup.enter="LoginIn">
            <b-form-group id="input-group-1" label="Login:" label-for="input-login">
                <b-form-input
                    id="input-login"
                    v-model="TxLogin"
                    type="text"
                    placeholder="Introduzca el nombre de usuario"
                    required
                ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Contraseña:" label-for="input-pw">
                <b-form-input
                    id="input-pw"
                    v-model="TxPw"
                    type="password"
                    placeholder="Introduzca su contraseña"
                    required
                ></b-form-input>
            </b-form-group>
            <b-button @click="LoginIn" variant="light">Acceder</b-button>
        </b-form>
        
    </div>
</template>

<style>
    #LoginInForm{
        width: 400px;
        position: relative;
        left: 30%;
        text-align: left;
    }
</style>

<script>
    export default {
    data() {
        return {
            TxLogin: '',
            TxPw: '',
            ChWithAccess: false
        }
    },
    methods: {
        LoginIn() {
            var param = {"login": this.TxLogin, "pw": this.TxPw};
            this.$socket.emit('LoginIn', param);
        }
    }
}
</script>