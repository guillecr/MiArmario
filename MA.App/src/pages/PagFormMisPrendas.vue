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

import DynamicForm from '../components/DynamicForm.vue';
import SocketEmit from '../SocketEmit';
import tools from '../tools';

export default {
  components:{
    DynamicForm
  },
  data: function(){
    return {
      sEmit: new SocketEmit(this.$socket, this.sockets, 'PagMisPrendas'),
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
    this.idPrenda = tools.getParamsURL('idPrenda');
    if (this.idPrenda == null){
      this.idPrenda = 1;
    } 
    var cm = this;
    this.sEmit.emitCall("GetInfoPrenda", this.idPrenda, function(response) {
      cm.objPrenda = response;
    });
  }
}
</script>

