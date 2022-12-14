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
import tools from "../tools";
export default {
  components:{
    DynamicForm
  },
  data: function(){
    return {
      serviceName:"PagMisPrendas",
      objPrenda:{},
      objFormPag:{
        TxTest: "Ejemplo",
        TxTest2: "Ejemplo2"
      },
      idPrenda:null
    }
  },
  mounted: function(){
    this.idPrenda = tool.getParamsURL('idPrenda');
    if (this.idPrenda == null){
      this.idPrenda = 1;
    } 
    var cm = this;
    tools.emitCall(this, "GetInfoPrenda", this.idPrenda, function(response) {
      cm.objPrenda = response;
    });
  }
}
</script>

