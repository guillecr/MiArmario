<template>
    <div class="Login">
        <b-form id="LoginInForm" @keyup.enter="LoginIn">
            <!-- <div class="LoginLogoDiv">
                <img class="LoginLogoIcon" alt="Logo" src="../assets/logo.png">
            </div> -->
            <h1 class="LoginHeader">Acceso</h1>
            <b-form-group class="LoginFrm" label="Usuario" label-for="input-login">
                <b-form-input
                    id="input-login"
                    class="LoginInput"
                    v-model="TxLogin"
                    type="text"
                    required
                ></b-form-input>
            </b-form-group>
            <b-form-group class="LoginFrm" label="Contraseña" label-for="input-pw">
                <b-form-input
                    id="input-pw"
                    class="LoginInput"
                    v-model="TxPw"
                    type="password"
                    required
                ></b-form-input>
            </b-form-group>
            <b-button class="LoginBtn" @click="LoginIn" variant="outline-danger">Acceder</b-button>
        </b-form>
        
    </div>
</template>

<style>
    .Login{
        background-image: url("../assets/FondoLogo.png");
        background-repeat: no-repeat;
        background-size: cover;
    }
    #LoginInForm{
        width: 400px;
        position: absolute;
        left: 15%;
        top: 30%;
        text-align: left;
        background-color: white;
        border: 1px black solid;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 5px 5px 15px rgb(58, 58, 58);
    }
    .LoginHeader{
        text-align: center;
        margin-bottom: 10px;
        font-family: 'Quicksand'
    }
    .LoginLogoDiv{
        width: 300px;
        margin-bottom: 20px;
    }
    .LoginLogoIcon{
        width: 100%;
        border-radius: 8px;
    }
    .LoginFrm{
        padding-left: 20px;
        padding-right: 20px;
        font-size: large;
        font-family: 'Quicksand'
    }
    .LoginBtn{
        position: relative;
        width: 150px;
        left: 180px;
    }
    @media (max-width: 485px) {
        #LoginInForm {
            left: 5px;
        }
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