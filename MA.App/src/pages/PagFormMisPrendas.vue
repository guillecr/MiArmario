<template>
  <div id="PagFormMisPrendas">
      <DynamicForm 
        idForm="FORM_TEST" 
        :objForm="objFormPag"/>
  </div>
</template>
<style scope>

</style>
<script>

import DynamicForm from '../components/DynamicForm.vue';
export default {
  components:{
    DynamicForm
  },
  data: function(){
    return {
      objFormPag:{
        TxTest: "Ejemplo",
        TxTest2: "Ejemplo2"
      }
    }
  }
}
</script>

