<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
        <li style="color:#fff;margin-top:8px;margin-right:5px;">
          <i class="fa fa-cubes" aria-hidden="true"></i> {{this.$store.state.namespace}}
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/"><i class="fa fa-sign-out" aria-hidden="true"></i>
            Exit</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class=" container-fluid">

    <h1 style="text-align:center">
      <b >
        Welcome to Kubernetes
      </b>
    </h1>
    <br>
    <br>
      <div>
         <img class="center" v-bind:src="'/images/kubernets.png'" />
     </div>
     <br><br>
     <div class="center">
       <h2 style="text-align:center">
         <b>Laboratório de Tecnologias de Informação</b>
       </h2>
     </div><br>
    <div class="center">
      <h3 style="text-align:center" >Aplicação realizada por:</h3><br>
      <h3 style="text-align:center" >David Jesus Guilherme</h3><br>
      <h3 style="text-align:center" >Luis Filipe Farinha Mateus</h3><br>
      <h3 style="text-align:center" >Paulo Miguel Veríssimo Custodio</h3><br>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data:function(){
    return {
      url: process.env.MIX_URL,
    }
  },
  methods:{

  },
  mounted(){



    this.$store.commit("setUser", "kubernetes");
    this.$store.commit("setNameSpace", "default");

  }

}
</script>
