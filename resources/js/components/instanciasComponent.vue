<template>
  <div>

    <div class="starter-template jumbotron bg-info">
      <h1>ISTO É A PAGINA DPS DO LOGIN CRL</h1>
    </div>

 <div class="form-group" text-align="center">
          <a class="btn btn-primary" v-on:click.prevent="getInstances()">Instances</a>
        </div>
  </div>
</template>

<script type="text/javascript">

export default {

  data: function() {
    return{
      //tokens:'',
      url: process.env.MIX_URL,
      };
    },
    methods: {
        getInstances(){
          axios.get(this.url + "/compute/v2.1/servers", {
            headers: {Authorization: ""} })
            
      
          .then(response=>{
            console.log(response.data);
          });

    },
    mounted() {
    
    }
  }
}
</script>
