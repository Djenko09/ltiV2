<template>
  <div>
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">List of Replicas</div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Age</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody v-for="replica in replicas">
            <tr>
              <td>{{replica.metadata.name}}</td>
              <td>{{replica.metadata.labels}}</td>
              <td>{{replica.metadata.managedFields[0].time}} Hours</td>
               <td>{{replica.spec.template.spec.containers[0].image}}</td>
            </tr>
          </tbody>
        </table>
        <!-- FIM tabela que lista os pods -->
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      replicas: [],
      replica: {}
    };
  },
  methods: {
    getReplicas() {
      //função para obter os pods
      axios
        .get(this.url + "/apis/apps/v1/namespaces/default/replicasets")

        .then(response => {
          console.log(response.data);
          this.replicas = response.data.items;
          var arrayLength = this.replicas.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.replicas[i].metadata.managedFields[0].time;
            var divideDiaHora = date.split("T");
            var dia = divideDiaHora[0].split("-");
            var divideHoraZ = divideDiaHora[1].split("Z");
            var horas = divideHoraZ[0].split(":");


            var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);

            var hoje = new Date().getTime();
            var segundosNamespace = data.getTime();

            var diferenca = hoje-data;
            diferenca = (diferenca / (1000*60*60)) - 1


            //vidaNamespace = vidaNamespace / 36000;
            this.replicas[i].metadata.managedFields[0].time = diferenca.toFixed(1);
          }
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getReplicas();
  }
};
</script>
