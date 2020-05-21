<template>
  <div class="jumbotron">

    <h1 style="text-align:center">
      <b >
        Welcome to Kubernets
      </b>
    </h1>
    <br>
    <br>
      <div>
         <img class="center" v-bind:src="'/images/kubernets.png'" width=100 height=300/>
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
</template>
<script>
export default {
  methods:{
    createPod(){
      axios.post("http://192.168.232.71:8080/api/v1/namespaces/default/pods",{

     "kind": "Pod",
     "apiVersion": "v1",
     "metadata":{
         "name": "nginx2",
         "namespace": "default",
         "labels": {
             "name": "nginx2"
         }
     },
     "spec": {
         "containers": [{
             "name": "nginx",
             "image": "nginx",
             "ports": [{"containerPort": 80}],
             "resources": {
                 "limits": {
                     "memory": "128Mi",
                     "cpu": "500m"
                 }
             }
         }]
     }

      }).then(response=>{
        console.log(response.data);
      })
    },
    getApi(){
      axios.get("http://192.168.28.140:8080/api/v1/pods")
    }
  },
  mounted(){
    // /this.createPod();
    //this.$store.commit("setApp", "kubernetes");
    this.$store.commit("setUser", "kubernetes");
    //console.log(this.$store.state.app);
  }

}
</script>
