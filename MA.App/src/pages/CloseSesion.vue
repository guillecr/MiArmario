<template>
  <div id="CloseSesion"></div> 
</template>
  <script>
  
  export default {
    data: function(){
      return {}
    },
    mounted(){
        document.cookie = "tokenAccess=";
        location.href = "/login";
    }
  }
  </script>