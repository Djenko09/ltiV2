
<template>

</template>

<script>
export default {

  data: function() {
    return {
      //tokens:'',
      url: process.env.MIX_URL,
    };
  },
methods:{
  logout(){
      this.$store.commit("clearToken");  ///limpa o token
      this.$toasted.info("Successfully logout!")
      this.$router.push('/login');
  }
},
  mounted(){
    this.logout();
  
  }
}
</script>
