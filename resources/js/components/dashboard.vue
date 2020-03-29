<template>
  <div>

    <div class="starter-template jumbotron bg-info">
      <h1>ISTO É A PAGINA DPS DO LOGIN CRL</h1>
      <a class="btn btn-primary"  v-on:click.prevent="getServers()">My servers</a>
    </div>
    <div class="">


    </div>


  </div>
</template>

<script type="text/javascript">

export default {

  data: function() {
    return{
      tokens:'',
      url: process.env.MIX_URL,
      };
    },
    methods: {
        getServers(){
          axios.get(this.url+'/compute/v2.1/servers', {
            headers: {
              Authorization: token
            }

          }).then(response=>{
            console.log(response);
          });

    },
    mounted() {
      console.log(tokens)
    }
  }
}
</script>
