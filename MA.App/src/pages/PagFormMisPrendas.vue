<template>
  <div id="PagFormMisPrendas">
      <DynamicForm 
        idForm="FORM_TEST" 
        :objForm="objPrenda"/>
  </div>
</template>
<style scope>

</style>

<script>

import tool from "../tools";
import DynamicForm from '../components/DynamicForm.vue';
export default {
  components:{
    DynamicForm
  },
  data: function(){
    return {
      objPrenda:{},
      objFormPag:{
        TxTest: "Ejemplo",
        TxTest2: "Ejemplo2"
      },
      idPrenda:null
    }
  },
  sockets:{
    PagMisPrendasGetInfoPrendaResponse(objPrenda){
      this.objPrenda = objPrenda;
    }
  },
  mounted: function(){
    this.idPrenda = tool.getParamsURL('idPrenda');
    if (this.idPrenda == null){
      this.idPrenda = 1;
    } 
    this.$socket.emit("PagMisPrendasGetInfoPrenda", this.idPrenda);
  }
}
</script>

