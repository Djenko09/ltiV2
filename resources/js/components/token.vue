<template>
  <div>

    <div class="starter-template jumbotron bg-info">
      <h1>ISTO É A PAGINA DPS DO LOGIN CRL</h1>
    </div>


  </div>
</template>

<script type="text/javascript">

export default {

  data: function() {
    return{
      tokens:'',
      };
    },
    methods: {
        token(){
          axios.post('http://192.168.232.20/identity/v3/auth/tokens', {
            auth:{
              identity:{
                methods:[
                  "password"
                ],
               password:{
                 user:{
                   name:"admin",
                   domain: {
                     id: "default",
                     name: "default"
                   },
                   password: "devstack"
                 }
               }
             }

      }
          }).then(response=>{
            this.tokens = response.data
          });

    },
    mounted() {
      console.log(tokens)
    }
  }
}
</script>
