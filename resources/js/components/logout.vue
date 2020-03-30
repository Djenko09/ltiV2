
<template>
    
</template>

<script>
export default {
    created(){
        axios.post('api/logout')
              .then(response => {
               this.$store.commit('clearUserAndToken');
               this.$toasted.show("You're logged out");
               this.$router.push('/')
          })
          .catch(error => {
              this.$store.commit('clearUserAndToken');
              console.log(error);
          })
       
    }
}
</script>